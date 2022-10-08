import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractService } from '../common/abstract.service';

@Injectable()
export class MapService extends AbstractService {
    constructor(prisma: PrismaService) {
        super(prisma, 'map');
    }
}
