import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { MapService } from './map.service';
import { AbstractController } from '../common/abstract.controller';
import { CreateMapDto, UpdateMapDto } from './dto';

@Controller('maps')
export class MapController extends AbstractController<
    CreateMapDto,
    UpdateMapDto
> {
    constructor(mapService: MapService) {
        super(mapService);
    }

    @Post()
    override create(@Body() dto: CreateMapDto): Promise<any> {
        return this.service.create(dto);
    }

    @Patch(':id')
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMapDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }
}
