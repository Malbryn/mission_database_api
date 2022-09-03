import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MapModule } from './map/map.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UserModule,
        PrismaModule,
        MapModule,
    ],
})
export class AppModule {}
