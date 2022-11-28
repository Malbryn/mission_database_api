import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { exclude } from '../helpers/exclude';
import { AbstractController } from '../common/abstract.controller';
import { RoleGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/decorator/roles.decorator';
import { UserRole } from '../auth/enum/user-role.enum';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController extends AbstractController<
    CreateUserDto,
    UpdateUserDto
> {
    constructor(private userService: UserService) {
        super(userService);
    }

    @Get('me')
    getMe(@GetUser() user: User) {
        return { ...exclude(user, ['password']) };
    }

    @Get(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.ADMIN)
    override get(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.service.get(id);
    }

    @Get()
    @UseGuards(RoleGuard)
    @Role(UserRole.ADMIN)
    override getAll(): Promise<any> {
        return this.service.getAll();
    }

    @Post()
    @UseGuards(RoleGuard)
    @Role(UserRole.ADMIN)
    override create(): Promise<any> {
        // Should use the auth/register endpoint instead
        throw new HttpException(
            'Method not allowed.',
            HttpStatus.METHOD_NOT_ALLOWED,
        );
    }

    @Patch(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.ADMIN)
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.ADMIN)
    override delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.service.delete(id);
    }
}
