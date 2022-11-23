import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MapModule } from './map/map.module';
import { StatusModule } from './status/status.module';
import { GameTypeModule } from './game-type/game-type.module';
import { DlcModule } from './dlc/dlc.module';
import { ModsetModule } from './modset/modset.module';
import { MissionModule } from './mission/mission.module';
import { MissionFileModule } from './mission-file/mission-file.module';
import { MulterModule } from '@nestjs/platform-express';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './auth/guard/role.guard';

@Module({
    imports: [
        MulterModule.register({ dest: './uploads/temp' }),
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UserModule,
        PrismaModule,
        MapModule,
        StatusModule,
        GameTypeModule,
        DlcModule,
        ModsetModule,
        MissionModule,
        MissionFileModule,
    ],
})
export class AppModule {}
