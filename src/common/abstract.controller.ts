import { JwtGuard } from '../auth/guard';
import { Controller, UseGuards } from '@nestjs/common';
import { AbstractService } from './abstract.service';
import { AbstractDto } from './abstract.dto';

@UseGuards(JwtGuard)
@Controller()
export abstract class AbstractController<
    T extends AbstractDto,
    S extends AbstractDto,
> {
    protected constructor(protected service: AbstractService) {}

    abstract create(dto: T, file?: Express.Multer.File): Promise<any>;

    abstract update(id: number, dto: S): Promise<any>;

    abstract get(id: number): Promise<any>;

    abstract getAll(): Promise<any>;

    abstract delete(id: number): Promise<any>;
}
