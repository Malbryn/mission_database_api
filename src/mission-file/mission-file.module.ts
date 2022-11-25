import { Module } from '@nestjs/common';
import { MissionFileController } from './mission-file.controller';
import { MissionFileService } from './mission-file.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [MissionFileController],
    providers: [MissionFileService],
})
export class MissionFileModule {}
