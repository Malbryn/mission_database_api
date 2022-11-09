import {
    Body,
    Controller,
    Param,
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

@Controller('mission-files')
export class MissionFileController extends AbstractController<
    CreateMissionFileDto,
    UpdateMissionFileDto
> {
    constructor(private missionFilesService: MissionFileService) {
        super(missionFilesService);
    }

    @Post()
    override create(@Body() dto: CreateMissionFileDto): Promise<any> {
        return this.service.create(dto);
    }

    @Patch(':id')
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMissionFileDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const filename = `${file.originalname}.pbo`;
                    callback(null, filename);
                },
            }),
        }),
    )
    handleUpload(
        @UploadedFile() file: Express.Multer.File,
        dto: CreateMissionFileDto,
    ): Promise<any> {
        console.log(file);
        return this.create(dto);
    }
}
