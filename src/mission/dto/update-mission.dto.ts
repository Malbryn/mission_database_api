import { AbstractDto } from '../../common/abstract.dto';
import {
    IsArray,
    IsDate,
    IsOptional,
    IsNumber,
    IsObject,
    IsString,
} from 'class-validator';

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

    @IsObject()
    @IsOptional()
    map?: any;

    @IsObject()
    @IsOptional()
    gameType?: any;

    @IsObject()
    @IsOptional()
    status?: any;

    @IsArray()
    @IsOptional()
    dlcs?: any[];

    @IsObject()
    @IsOptional()
    modset?: any;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsObject()
    @IsOptional()
    createdBy?: any;

    @IsArray()
    @IsOptional()
    missionFiles?: any[];
}
