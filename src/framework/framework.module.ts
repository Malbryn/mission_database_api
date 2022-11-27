import { Module } from '@nestjs/common';
import { FrameworkController } from './framework.controller';
import { FrameworkService } from './framework.service';

@Module({
    controllers: [FrameworkController],
    providers: [FrameworkService],
})
export class FrameworkModule {}
