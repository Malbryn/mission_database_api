import { JwtGuard } from '../auth/guard';
import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { AbstractService } from './abstract.service';
import { AbstractDto } from './abstract.dto';

@UseGuards(JwtGuard)
@Controller()
export abstract class AbstractController<
    T extends AbstractDto,
    S extends AbstractDto,
> {
    protected constructor(protected service: AbstractService) {}

    abstract create(dto: T): Promise<any>;

    abstract update(id: number, dto: S): Promise<any>;

    @Get(':id')
    get(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.service.get(id);
    }

    @Get()
    getAll(): Promise<any> {
        return this.service.getAll();
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.service.delete(id);
    }
}
