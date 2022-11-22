import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractDto } from '../common/abstract.dto';
import { UpdateMissionDto } from './dto';

@Injectable()
export class MissionService extends AbstractService {
    selectedFields: object = {
        id: true,
        name: true,
        author: true,
        slotsMin: true,
        slotsMax: true,
        map: true,
        gameType: true,
        status: true,
        dlcs: {
            include: {
                dlc: true,
            },
        },
        modset: true,
        description: true,
        createdBy: true,
        createdAt: true,
        missionFiles: true,
    };

    constructor(prisma: PrismaService) {
        super(prisma, 'mission');
    }

    override async get(id: number): Promise<AbstractDto> {
        const result = await this.model.findFirst({
            where: {
                id: id,
            },
            select: this.selectedFields,
        });

        if (!result)
            throw new HttpException('Not found.', HttpStatus.NOT_FOUND);

        const mappedResult = {
            ...result,
            dlcs: result.dlcs.map((dlc: any) => dlc['dlc']),
        };

        return mappedResult;
    }

    override async getAll(): Promise<AbstractDto[]> {
        const result = await this.model.findMany({
            select: this.selectedFields,
        });

        const mappedResult = result.map((element: any) => {
            return {
                ...element,
                dlcs: element.dlcs.map((dlc: any) => dlc['dlc']),
            };
        });

        return mappedResult;
    }

    // TODO: create

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
            include: {
                map: true,
            },
        });
    }
}
