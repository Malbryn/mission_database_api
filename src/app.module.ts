import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MapModule } from './map/map.module';

@Module({
    imports: [AuthModule, UserModule, PrismaModule, MapModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
