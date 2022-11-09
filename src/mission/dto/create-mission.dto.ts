import { AbstractDto } from '../../common/abstract.dto';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDlcDto } from '../../dlc/dto';

export class CreateMissionDto extends AbstractDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    slotsMin: number;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    slotsMax: string;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    mapId: any;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    gameTypeId: any;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    statusId: any;

    @IsArray()
    @Type(() => Number)
    @IsNotEmpty()
    dlcIds: number[];

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    modsetId: any;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDate()
    @IsOptional()
    createdAt: Date;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    createdById: any;

    @IsArray()
    @IsOptional()
    missionFiles: any[];
}
