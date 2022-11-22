import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractDto } from '../common/abstract.dto';
import { CreateMissionDto, UpdateMissionDto } from './dto';

@Injectable()
export class MissionService extends AbstractService {
    readonly relatedFields = {
        map: true,
        gameType: true,
        status: true,
        modset: true,
        createdBy: true,
        missionFiles: true,
        dlcs: {
            include: {
                dlc: true,
            },
        },
    };

    readonly allFields = {
        id: true,
        name: true,
        author: true,
        slotsMin: true,
        slotsMax: true,
        description: true,
        createdAt: true,
        ...this.relatedFields,
    };

    constructor(prisma: PrismaService) {
        super(prisma, 'mission');
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
            dlcs: result.dlcs.map((dlc: any) => dlc['dlc']),
        };
    }

    override async getAll(): Promise<AbstractDto[]> {
        const result = await this.model.findMany({
            select: this.allFields,
        });

        return result.map((element: any) => {
            return {
                ...element,
                dlcs: element.dlcs.map((dlc: any) => dlc['dlc']),
            };
        });
    }

    override async create(dto: CreateMissionDto): Promise<AbstractDto> {
        return await this.model.create({
            data: {
                ...dto,
                dlcs: {
                    create: dto.dlcs.map((id: number) => ({
                        dlc: {
                            connect: {
                                id: id,
                            },
                        },
                    })),
                },
            },
            include: this.relatedFields,
        });
    }

    override async update(
        id: number,
        dto: UpdateMissionDto,
    ): Promise<AbstractDto> {
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
            data: {
                ...dto,
                dlcs: {
                    deleteMany: {},
                    create: dto.dlcs.map((id: number) => ({
                        dlc: {
                            connect: {
                                id: id,
                            },
                        },
                    })),
                },
            },
            include: this.relatedFields,
        });
    }
}
