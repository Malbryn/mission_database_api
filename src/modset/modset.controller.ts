import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { AbstractController } from '../common/abstract.controller';
import { ModsetService } from './modset.service';
import { CreateModsetDto, UpdateModsetDto } from './dto';

@Controller('modsets')
export class ModsetController extends AbstractController<
    CreateModsetDto,
    UpdateModsetDto
> {
    constructor(modsetService: ModsetService) {
        super(modsetService);
    }

    @Post()
    override create(@Body() dto: CreateModsetDto): Promise<any> {
        return this.service.create(dto);
    }

    @Patch(':id')
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateModsetDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }
}
