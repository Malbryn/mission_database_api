import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AbstractController } from '../common/abstract.controller';
import { ModsetService } from './modset.service';
import { CreateModsetDto, UpdateModsetDto } from './dto';
import { RoleGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/decorator/roles.decorator';
import { UserRole } from '../auth/enum/user-role.enum';

@Controller('modsets')
export class ModsetController extends AbstractController<
    CreateModsetDto,
    UpdateModsetDto
> {
    constructor(private modsetService: ModsetService) {
        super(modsetService);
    }

    @Get(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.CREATOR)
    override get(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.service.get(id);
    }

    @Get()
    @UseGuards(RoleGuard)
    @Role(UserRole.CREATOR)
    override getAll(): Promise<any> {
        return this.service.getAll();
    }

    @Post()
    @UseGuards(RoleGuard)
    @Role(UserRole.ADMIN)
    override create(@Body() dto: CreateModsetDto): Promise<any> {
        return this.service.create(dto);
    }

    @Patch(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.ADMIN)
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateModsetDto,
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
