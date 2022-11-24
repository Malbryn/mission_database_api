import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { exclude } from '../helpers/exclude';

@Injectable()
export class AuthService {
    static readonly TOKEN_LIFETIME = '30d';

    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async register(dto: AuthDto): Promise<string> {
        try {
            const hash = await argon.hash(dto.password);

            const user = await this.prisma.user.create({
                data: {
                    username: dto.username,
                    password: hash,
                },
            });

            return await this.signToken(user.id, user.username);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Username already exists.');
                }
            }
            throw error;
        }
    }

    async logIn(dto: AuthDto): Promise<object> {
        const user = await this.findUser(dto.username);
        if (!user) throw new ForbiddenException('Incorrect credentials.');

        const passwordMatch = await argon.verify(user.password, dto.password);
        if (!passwordMatch)
            throw new ForbiddenException('Incorrect credentials.');

        const accessToken = await this.signToken(user.id, user.username);
        const updatedUser = await this.updateLoginTimestamp(user.id);

        return {
            ...exclude(updatedUser, ['password']),
            accessToken: accessToken,
        };
    }

    async signToken(userID: number, username: string): Promise<string> {
        const secret = this.config.get('JWT_SECRET');
        const payload = {
            sub: userID,
            username,
        };

        return await this.jwt.signAsync(payload, {
            expiresIn: AuthService.TOKEN_LIFETIME,
            secret: secret,
        });
    }

    private async findUser(username: string): Promise<any> {
        return await this.prisma.user.findFirst({
            where: {
                username: username,
            },
        });
    }

    private async updateLoginTimestamp(id: number): Promise<any> {
        return await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                lastLogin: new Date().toISOString(),
            },
        });
    }
}
