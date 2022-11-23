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
import { MissionService } from './mission.service';
import { CreateMissionDto, UpdateMissionDto } from './dto';
import { RoleGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/decorator/roles.decorator';
import { UserRole } from '../auth/enum/user-role.enum';

@Controller('missions')
export class MissionController extends AbstractController<
    CreateMissionDto,
    UpdateMissionDto
> {
    constructor(private missionService: MissionService) {
        super(missionService);
    }

    @Get(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.MEMBER)
    override get(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.service.get(id);
    }

    @Get()
    @UseGuards(RoleGuard)
    @Role(UserRole.MEMBER)
    override getAll(): Promise<any> {
        return this.service.getAll();
    }

    @Post()
    @UseGuards(RoleGuard)
    @Role(UserRole.CREATOR)
    override create(@Body() dto: CreateMissionDto): Promise<any> {
        return this.service.create(dto);
    }

    @Patch(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.STAFF)
    override update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMissionDto,
    ): Promise<any> {
        return this.service.update(id, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    @UseGuards(RoleGuard)
    @Role(UserRole.STAFF)
    override delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.service.delete(id);
    }
}
