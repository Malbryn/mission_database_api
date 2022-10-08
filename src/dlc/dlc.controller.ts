import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { DlcService } from './dlc.service';
import { AbstractController } from '../common/abstract.controller';
import { CreateDlcDto, UpdateDlcDto } from './dto';

@Controller('dlcs')
export class DlcController extends AbstractController<
    CreateDlcDto,
    UpdateDlcDto
> {
    constructor(dlcService: DlcService) {
        super(dlcService);
    }

    @Post()
    override create(@Body() dto: CreateDlcDto): Promise<any> {
        return this.service.create(dto);
    }

    @Patch(':id')
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDlcDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }
}
