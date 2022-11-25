import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractDto } from '../common/abstract.dto';
import { exclude } from '../helpers/exclude';
import { CreateMissionFileDto, UpdateMissionFileDto } from './dto';

@Injectable()
export class MissionFileService extends AbstractService {
    readonly relatedFields = {
        createdBy: true,
        mission: true,
    };

    readonly allFields = {
        id: true,
        name: true,
        path: true,
        downloadUrl: true,
        version: true,
        description: true,
        createdAt: true,
        ...this.relatedFields,
    };

    constructor(prisma: PrismaService) {
        super(prisma, 'missionFile');
    }

    override async get(id: number): Promise<AbstractDto> {
        const result = await this.model.findFirst({
            where: {
                id: id,
            },
            select: this.allFields,
        });

        if (!result)
            throw new HttpException('Not found.', HttpStatus.NOT_FOUND);

        return {
            ...result,
            createdBy: exclude(result.createdBy, ['password']),
        };
    }

    override async getAll(): Promise<AbstractDto[]> {
        const result = await this.model.findMany({
            select: this.allFields,
        });

        return result.map((element: any) => {
            return {
                ...element,
                createdBy: exclude(element.createdBy, ['password']),
            };
        });
    }

    override async create(dto: CreateMissionFileDto): Promise<AbstractDto> {
        const result = await this.model.create({
            data: { ...dto },
            include: this.relatedFields,
        });

        const reducedResult = exclude(result, ['missionId', 'createdById']);

        return {
            ...reducedResult,
            createdBy: exclude(result.createdBy, ['password']),
        };
    }

    override async update(
        id: number,
        dto: UpdateMissionFileDto,
    ): Promise<AbstractDto> {
        const data = await this.model.findUnique({
            where: {
                id: id,
            },
        });

        if (!data) throw new HttpException('Not found.', HttpStatus.NOT_FOUND);

        const result = await this.model.update({
            where: {
                id: id,
            },
            data: { ...dto },
            include: this.relatedFields,
        });

        const reducedResult = exclude(result, ['missionId', 'createdById']);

        return {
            ...reducedResult,
            createdBy: exclude(result.createdBy, ['password']),
        };
    }
}
