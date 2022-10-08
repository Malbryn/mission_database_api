import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { AbstractController } from '../common/abstract.controller';
import { GameTypeService } from './game-type.service';
import { CreateGameTypeDto, UpdateGameTypeDto } from './dto';

@Controller('game-types')
export class GameTypeController extends AbstractController<
    CreateGameTypeDto,
    UpdateGameTypeDto
> {
    constructor(gameTypeService: GameTypeService) {
        super(gameTypeService);
    }

    @Post()
    override create(@Body() dto: CreateGameTypeDto): Promise<any> {
        return this.service.create(dto);
    }

    @Patch(':id')
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateGameTypeDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }
}
