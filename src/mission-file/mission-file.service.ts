import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractDto } from '../common/abstract.dto';

@Injectable()
export class MissionFileService extends AbstractService {
    constructor(prisma: PrismaService) {
        super(prisma, 'missionFile');
    }

    override async get(id: number): Promise<AbstractDto> {
        const data = await this.model.findFirst({
            where: {
                id: id,
            },
            include: {
                mission: true,
                createdBy: true,
            },
        });

        if (!data) throw new HttpException('Not found.', HttpStatus.NOT_FOUND);

        return data;
    }

    override async getAll(): Promise<AbstractDto[]> {
        return await this.model.findMany({
            include: {
                mission: true,
                createdBy: true,
            },
        });
    }

    override async create(dto: AbstractDto): Promise<AbstractDto> {
        return await this.model.create({
            data: { ...dto },
            include: {
                mission: true,
                createdBy: true,
            },
        });
    }

    override async update(id: number, dto: AbstractDto): Promise<AbstractDto> {
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
            include: {
                mission: true,
                createdBy: true,
            },
        });
    }
}
