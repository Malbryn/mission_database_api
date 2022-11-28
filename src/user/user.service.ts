import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { PrismaService } from '../prisma/prisma.service';
import { AbstractDto } from '../common/abstract.dto';
import { exclude } from '../helpers/exclude';

@Injectable()
export class UserService extends AbstractService {
    constructor(prisma: PrismaService) {
        super(prisma, 'user');
    }

    override async get(id: number): Promise<AbstractDto> {
        const result = await this.model.findFirst({
            where: {
                id: id,
            },
        });

        if (!result)
            throw new HttpException('Not found.', HttpStatus.NOT_FOUND);

        return {
            ...exclude(result, ['password']),
        };
    }

    override async getAll(): Promise<AbstractDto[]> {
        const result = await this.model.findMany();

        return result.map((element: any) => {
            return {
                ...exclude(element, ['password']),
            };
        });
    }
}
