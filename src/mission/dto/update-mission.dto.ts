import { AbstractDto } from '../../common/abstract.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMissionDto extends AbstractDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    author?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    slotsMin?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    slotsMax?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    mapId?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    gameTypeId?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    statusId?: number;

    // @Transform((value) => JSON.parse(value.obj.dlcs))
    @IsNumber({}, { each: true })
    @IsOptional()
    dlcs: number[];

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    modsetId?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    createdById?: number;

    @IsArray()
    @IsOptional()
    missionFiles?: any[];
}
