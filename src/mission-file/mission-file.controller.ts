import {
    BadRequestException,
    Body,
    Controller,
    FileTypeValidator,
    HttpStatus,
    Logger,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { AbstractController } from '../common/abstract.controller';
import { MissionFileService } from './mission-file.service';
import { CreateMissionFileDto, UpdateMissionFileDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AbstractDto } from '../common/abstract.dto';
import { Octokit } from '@octokit/rest';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

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
    ) {
        super(missionFilesService);
        this.initRepository();
    }

    override create(@Body() dto: AbstractDto): Promise<any> {
        return this.service.create(dto);
    }

    @Patch(':id')
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMissionFileDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }

    @UseInterceptors(
        FileInterceptor(
            'file',
            MissionFileController.getFileInterceptorSettings(),
        ),
    )
    @Post()
    async uploadAndCreate(
        @UploadedFile(MissionFileController.getFileParserPipe())
        file: Express.Multer.File,
        @Body() dto: CreateMissionFileDto,
    ): Promise<void> {
        const pboName = file.filename; // MF_test.Stratis.pbo
        const fileName = pboName.split('.pbo')[0]; // MF_test.Stratis

        const path = `${fileName}.v${dto.version}/${pboName}`;
        const commitMessage = `Add ${fileName}.v${dto.version}`;

        const downloadUrl = await this.handleUpload(file, path, commitMessage);

        if (downloadUrl === '') this.logger.warn('Download URL is undefined');

        const { missionId, name, version, createdById, description } = dto;

        return this.create({
            mission: {
                connect: {
                    id: missionId,
                },
            },
            name,
            version,
            createdBy: {
                connect: {
                    id: createdById,
                },
            },
            downloadUrl: downloadUrl,
            path: path,
            description: description,
        });
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
    ): Promise<string> {
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
            this.logger.error('Failed to commit mission file');
            throw new BadRequestException('Failed to commit mission file.');
        } finally {
            this.cleanUp(uploadedFilePath);
        }

        return response.data.content?.download_url ?? '';
    }

    private initRepository(): void {
        this.logger.log('Initialising GitHub repository...');

        // GitHub PAT
        const token = this.configService.get('GITHUB_TOKEN');
        if (!token) throw new Error('GITHUB_TOKEN is not defined!');

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
}
