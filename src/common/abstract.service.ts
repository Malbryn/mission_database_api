import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractDto } from './abstract.dto';

@Injectable()
export abstract class AbstractService {
    private model;

    protected constructor(
        protected prisma: PrismaService,
        private type: string,
    ) {
        this.model = (this.prisma as any)[type];
    }

    async get(id: number) {
        const data = await (this.prisma as any)[this.type].findFirst({
            where: {
                id: id,
            },
        });

        if (!data) throw new HttpException('Not found.', HttpStatus.NOT_FOUND);

        return data;
    }

    async getAll() {
        return await this.model.findMany();
    }

    async create(dto: AbstractDto) {
        return await this.model.create({
            data: { ...dto },
        });
    }

    async update(id: number, dto: AbstractDto) {
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

    async delete(id: number) {
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
