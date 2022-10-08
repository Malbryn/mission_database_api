import { Module } from '@nestjs/common';
import { ModsetController } from './modset.controller';
import { ModsetService } from './modset.service';

@Module({
    controllers: [ModsetController],
    providers: [ModsetService],
})
export class ModsetModule {}
