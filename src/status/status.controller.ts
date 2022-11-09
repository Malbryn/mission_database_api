import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { AbstractController } from '../common/abstract.controller';
import { StatusService } from './status.service';
import { CreateStatusDto, UpdateStatusDto } from './dto';

@Controller('statuses')
export class StatusController extends AbstractController<
    CreateStatusDto,
    UpdateStatusDto
> {
    constructor(private statusService: StatusService) {
        super(statusService);
    }

    @Post()
    override create(@Body() dto: CreateStatusDto): Promise<any> {
        return this.service.create(dto);
    }

    @Patch(':id')
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateStatusDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }
}
