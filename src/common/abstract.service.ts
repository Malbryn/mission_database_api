import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractDto } from './abstract.dto';

@Injectable()
export abstract class AbstractService {
    protected model;

    protected constructor(
        protected prisma: PrismaService,
        protected type: string,
    ) {
        this.model = (this.prisma as any)[type];
    }

    async get(id: number): Promise<AbstractDto> {
        const data = await this.model.findFirst({
            where: {
                id: id,
            },
        });

        if (!data) throw new HttpException('Not found.', HttpStatus.NOT_FOUND);

        return data;
    }

    async getAll(): Promise<AbstractDto[]> {
        return await this.model.findMany();
    }

    async create(dto: AbstractDto): Promise<AbstractDto> {
        return await this.model.create({
            data: { ...dto },
        });
    }

    async update(id: number, dto: AbstractDto): Promise<AbstractDto> {
        const data = await this.model.findUnique({
            where: {
                id: id,
            },
        });

        if (!data) throw new HttpException('Not found.', HttpStatus.NOT_FOUND);

        return await this.model.update({
            where: {
                id: id,
            },
            data: { ...dto },
        });
    }

    async delete(id: number): Promise<AbstractDto> {
        const data = await this.model.findUnique({
            where: {
                id: id,
            },
        });

        if (!data) throw new HttpException('Not found.', HttpStatus.NOT_FOUND);

        return await this.model.delete({
            where: {
                id: id,
            },
        });
    }
}
