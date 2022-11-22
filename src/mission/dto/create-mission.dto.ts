import { AbstractDto } from '../../common/abstract.dto';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateMissionDto extends AbstractDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    slotsMin: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    slotsMax: string;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    mapId: any;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    gameTypeId: any;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    statusId: any;

    @Transform((value) => JSON.parse(value.obj.dlcs))
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    dlcs: number[];

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    modsetId: any;

    @IsString()
    @IsNotEmpty()
    description: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    createdById: any;

    @IsArray()
    @IsOptional()
    missionFiles: any[];
}
