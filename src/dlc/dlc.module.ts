import { Module } from '@nestjs/common';
import { DlcController } from './dlc.controller';
import { DlcService } from './dlc.service';

@Module({
    controllers: [DlcController],
    providers: [DlcService],
})
export class DlcModule {}
