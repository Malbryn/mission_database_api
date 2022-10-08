import { Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MissionFileService extends AbstractService {
    constructor(prisma: PrismaService) {
        super(prisma, 'missionFile');
    }
}
