import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { exclude } from '../helpers/exclude';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    @Get('me')
    getMe(@GetUser() user: User) {
        return { ...exclude(user, ['password']) };
    }

    @Patch()
    editUser() {
        // TODO
    }
}
