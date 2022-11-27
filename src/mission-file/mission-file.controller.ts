import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Patch,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AbstractController } from '../common/abstract.controller';
import { MissionFileService } from './mission-file.service';
import { CreateMissionFileDto, UpdateMissionFileDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Octokit } from '@octokit/rest';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { RoleGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/decorator/roles.decorator';
import { UserRole } from '../auth/enum/user-role.enum';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';

@Controller('mission-files')
export class MissionFileController extends AbstractController<
    CreateMissionFileDto,
    UpdateMissionFileDto
> {
    readonly logger = new Logger(MissionFileController.name);

    // Uploaded PBO size limit in bytes
    static readonly FILE_SIZE_LIMIT = 10485760;

    octokit: Octokit;
    repositoryOwner: string;
    repositoryName: string;
    committer: { name: string; email: string };

    constructor(
        private missionFilesService: MissionFileService,
        private configService: ConfigService,
        private httpService: HttpService,
    ) {
        super(missionFilesService);
        this.initRepository();
    }

    @Get(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.CREATOR)
    override get(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.service.get(id);
    }

    @Get()
    @UseGuards(RoleGuard)
    @Role(UserRole.CREATOR)
    override getAll(): Promise<any> {
        return this.service.getAll();
    }

    @UseInterceptors(
        FileInterceptor(
            'file',
            MissionFileController.getFileInterceptorSettings(),
        ),
    )
    @Post()
    @UseGuards(RoleGuard)
    @Role(UserRole.ADMIN)
    override async create(
        @Body() dto: CreateMissionFileDto,
        @UploadedFile(MissionFileController.getFileParserPipe())
        file: Express.Multer.File,
    ): Promise<any> {
        const pboName = file.filename; // MF_test.Stratis.pbo
        const fileName = pboName.split('.pbo')[0]; // MF_test.Stratis

        const path = `${fileName}.v${dto.version}/${pboName}`;
        const commitMessage = `Add ${fileName}.v${dto.version}`;

        const response = await this.handleUpload(file, path, commitMessage);

        if (response.downloadUrl === '')
            this.logger.warn('Download URL of the uploaded file is empty');
        if (response.sha === '')
            this.logger.warn('SHA of the uploaded file is empty');

        const { missionId, version, createdById, description } = dto;

        return this.service.create({
            mission: {
                connect: {
                    id: missionId,
                },
            },
            name: fileName,
            version,
            createdBy: {
                connect: {
                    id: createdById,
                },
            },
            downloadUrl: response.downloadUrl,
            sha: response.sha,
            path: path,
            description: description,
        });
    }

    @Patch(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.ADMIN)
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMissionFileDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.ADMIN)
    override async delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
        const target = (await this.service.get(id)) as any;
        const path = target.path;
        const commitMessage = `Delete ${path}`;

        const request = {
            owner: this.repositoryOwner,
            repo: this.repositoryName,
            path: path,
            message: commitMessage,
            committer: this.committer,
            sha: target.sha,
        };

        try {
            await this.octokit.rest.repos.deleteFile(request);

            this.logger.log(`Deleted file from GitHub: { path: ${path} }`);
        } catch (e) {
            this.logger.error('Failed to delete mission file', e);
            throw new InternalServerErrorException(
                'Failed to delete mission file.',
            );
        }

        return this.service.delete(id);
    }

    @Get(':id/download')
    @UseGuards(RoleGuard)
    @Role(UserRole.CREATOR)
    async downloadFile(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: Response,
    ): Promise<any> {
        const missionFile = (await this.service.get(id)) as any;
        const url = missionFile.downloadUrl;
        const token = this.getToken();

        const response = await this.httpService.axiosRef(url, {
            responseType: 'stream',
            headers: {
                Authorization: 'token ' + token,
            },
        });

        response.data.pipe(res);
        return response;
    }

    static getFileInterceptorSettings(): MulterOptions {
        return {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const filename = file.originalname;
                    callback(null, filename);
                },
            }),
        };
    }

    static getFileParserPipe(): ParseFilePipe {
        return new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: MissionFileController.FILE_SIZE_LIMIT,
                }),
                new FileTypeValidator({
                    fileType: 'application/octet-stream',
                }),
            ],
            fileIsRequired: true,
            errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        });
    }

    private async handleUpload(
        file: Express.Multer.File,
        path: string,
        commitMessage: string,
    ): Promise<{ downloadUrl: string; sha: string }> {
        // Read and convert the uploaded file to base64 string
        const uploadedFilePath = join(process.cwd(), file.path);
        const uploadedFile = fs.readFileSync(uploadedFilePath);
        const content = uploadedFile.toString('base64');

        const request = {
            owner: this.repositoryOwner,
            repo: this.repositoryName,
            path: path,
            message: commitMessage,
            committer: this.committer,
            content: content,
        };

        this.logger.log(
            `Committing mission file to GitHub: { message: ${request.message} }`,
        );

        let response;

        try {
            response = await this.octokit.rest.repos.createOrUpdateFileContents(
                request,
            );

            this.logger.log(
                `Pushed commit to GitHub: { sha: ${
                    response.data.content?.sha ?? 'null'
                } }`,
            );
        } catch (e) {
            this.logger.error('Failed to commit mission file', e);
            throw new BadRequestException('Failed to commit mission file.');
        } finally {
            this.cleanUp(uploadedFilePath);
        }

        const responseData = response.data.content;

        return {
            downloadUrl: responseData?.download_url ?? '',
            sha: responseData?.sha ?? '',
        };
    }

    private initRepository(): void {
        this.logger.log('Initialising GitHub repository...');

        // GitHub PAT
        const token = this.getToken();

        this.octokit = new Octokit({
            auth: token,
        });

        // Repository owner
        const repoOwner = this.configService.get('GITHUB_REPO_OWNER');
        if (!repoOwner) throw new Error('GITHUB_REPO_OWNER is not defined!');

        this.repositoryOwner = repoOwner;

        // Repository name
        const repoName = this.configService.get('GITHUB_REPO_NAME');
        if (!repoName) throw new Error('GITHUB_REPO_NAME is not defined!');

        this.repositoryName = repoName;

        // Committer
        const committer = {
            name: this.configService.get('GITHUB_COMMITTER_NAME'),
            email: this.configService.get('GITHUB_COMMITTER_EMAIL'),
        };

        if (!committer.name)
            throw new Error('GITHUB_COMMITTER_NAME is not defined!');
        if (!committer.email)
            throw new Error('GITHUB_COMMITTER_EMAIL is not defined!');

        this.committer = committer;

        // Log
        this.logger.log(
            `Finished initialising GitHub repository: ${repoOwner}/${repoName}`,
        );
        this.logger.log(
            `Using committer: { name: ${committer.name}, email: ${committer.email} }`,
        );
    }

    private cleanUp(filePath: string): void {
        fs.rm(filePath, (error) => {
            if (error) {
                this.logger.warn(`Failed to remove uploaded file: ${filePath}`);
            } else {
                this.logger.debug(`Removed uploaded file: ${filePath}`);
            }
        });
    }

    private getToken(): string {
        const token = this.configService.get('GITHUB_TOKEN');
        if (!token) throw new Error('GITHUB_TOKEN is not defined!');

        return token;
    }
}
