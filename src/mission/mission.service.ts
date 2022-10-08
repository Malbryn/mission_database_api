import { Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MissionService extends AbstractService {
    constructor(prisma: PrismaService) {
        super(prisma, 'mission');
    }
}
