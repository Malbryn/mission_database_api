import { Module } from '@nestjs/common';
import { GameTypeController } from './game-type.controller';
import { GameTypeService } from './game-type.service';

@Module({
    controllers: [GameTypeController],
    providers: [GameTypeService],
})
export class GameTypeModule {}
