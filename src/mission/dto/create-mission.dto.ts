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

export class CreateMissionDto extends AbstractDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsNumber()
    @IsNotEmpty()
    slotsMin: number;

    @IsNumber()
    @IsNotEmpty()
    slotsMax: string;

    @IsObject()
    @IsNotEmpty()
    map: any;

    @IsObject()
    @IsNotEmpty()
    gameType: any;

    @IsObject()
    @IsNotEmpty()
    status: any;

    @IsArray()
    @IsNotEmpty()
    dlcs: any[];

    @IsObject()
    @IsNotEmpty()
    modset: any;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDate()
    @IsNotEmpty()
    createdAt: Date;

    @IsObject()
    @IsNotEmpty()
    createdBy: any;

    @IsArray()
    @IsOptional()
    missionFiles: any[];
}
