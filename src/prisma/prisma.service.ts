import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: 'postgresql://jrghcizttwxnvz:25eef264b42b74116aa01dc4e185bba29dbe59f07f72656ebe1869965fdfb3bf@ec2-54-228-32-29.eu-west-1.compute.amazonaws.com:5432/d7s9tf5dd4mh6i?schema=public',
                },
            },
        });
    }
}
