import { Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatusService extends AbstractService {
    constructor(prisma: PrismaService) {
        super(prisma, 'status');
    }
}
