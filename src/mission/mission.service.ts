import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractDto } from '../common/abstract.dto';
import { CreateMissionDto, UpdateMissionDto } from './dto';
import { exclude } from '../helpers/exclude';

@Injectable()
export class MissionService extends AbstractService {
    readonly relatedFields = {
        map: true,
        gameType: true,
        status: true,
        modset: true,
        framework: true,
        createdBy: true,
        missionFiles: {
            include: {
                createdBy: true,
            },
        },
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
        notes: true,
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

        result.missionFiles.forEach((missionFile: any) => {
            missionFile.createdBy = exclude(missionFile.createdBy, [
                'password',
            ]);
        });

        return {
            ...result,
            createdBy: exclude(result.createdBy, ['password']),
            dlcs: result.dlcs.map((dlc: any) => dlc['dlc']),
        };
    }

    override async getAll(): Promise<AbstractDto[]> {
        const result = await this.model.findMany({
            select: this.allFields,
        });

        result.forEach((mission: any) => {
            mission.missionFiles.forEach((missionFile: any) => {
                missionFile.createdBy = exclude(missionFile.createdBy, [
                    'password',
                ]);
            });
        });

        return result.map((element: any) => {
            return {
                ...element,
                createdBy: exclude(element.createdBy, ['password']),
                dlcs: element.dlcs.map((dlc: any) => dlc['dlc']),
            };
        });
    }

    override async create(dto: CreateMissionDto): Promise<AbstractDto> {
        const result = await this.model.create({
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

        const reducedResult = exclude(result, [
            'mapId',
            'gameTypeId',
            'statusId',
            'modsetId',
            'frameworkId',
            'createdById',
        ]);

        result.missionFiles.forEach((missionFile: any) => {
            missionFile.createdBy = exclude(missionFile.createdBy, [
                'password',
            ]);
        });

        return {
            ...reducedResult,
            createdBy: exclude(reducedResult.createdBy, ['password']),
            dlcs: result.dlcs.map((dlc: any) => dlc['dlc']),
        };
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

        const result = await this.model.update({
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

        const reducedResult = exclude(result, [
            'mapId',
            'gameTypeId',
            'statusId',
            'modsetId',
            'frameworkId',
            'createdById',
        ]);

        result.missionFiles.forEach((missionFile: any) => {
            missionFile.createdBy = exclude(missionFile.createdBy, [
                'password',
            ]);
        });

        return {
            ...reducedResult,
            createdBy: exclude(reducedResult.createdBy, ['password']),
            dlcs: result.dlcs.map((dlc: any) => dlc['dlc']),
        };
    }
}
