import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { AbstractController } from '../common/abstract.controller';
import { MissionService } from './mission.service';
import { CreateMissionDto, UpdateMissionDto } from './dto';

@Controller('missions')
export class MissionController extends AbstractController<
    CreateMissionDto,
    UpdateMissionDto
> {
    constructor(missionService: MissionService) {
        super(missionService);
    }

    @Post()
    override create(@Body() dto: CreateMissionDto): Promise<any> {
        return this.service.create(dto);
    }

    @Patch(':id')
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMissionDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }
}
