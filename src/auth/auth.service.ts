import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    register() {
        return { message: 'Welcome!' };
    }

    logIn() {
        return { message: 'Welcome back!' };
    }
}
