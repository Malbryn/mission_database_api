import { AbstractDto } from '../../common/abstract.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateMissionDto extends AbstractDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    author?: string;

    @IsNumber()
    @IsOptional()
    slotsMin?: number;

    @IsNumber()
    @IsOptional()
    slotsMax?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    mapId?: number;

    @IsNumber()
    @IsOptional()
    gameTypeId?: number;

    @IsNumber()
    @IsOptional()
    statusId?: number;

    @Transform((value) => JSON.parse(value.obj.dlcs))
    @IsNumber({}, { each: true })
    @IsOptional()
    dlcs: number[];

    @IsNumber()
    @IsOptional()
    modsetId?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    createdById?: number;

    @IsArray()
    @IsOptional()
    missionFiles?: any[];
}
