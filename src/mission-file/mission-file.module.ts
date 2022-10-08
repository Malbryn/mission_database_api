import { Module } from '@nestjs/common';
import { MissionFileController } from './mission-file.controller';
import { MissionFileService } from './mission-file.service';

@Module({
    controllers: [MissionFileController],
    providers: [MissionFileService],
})
export class MissionFileModule {}
