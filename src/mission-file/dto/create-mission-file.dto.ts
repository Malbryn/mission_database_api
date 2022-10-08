import { AbstractDto } from '../../common/abstract.dto';
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateMissionFileDto extends AbstractDto {
    @IsObject()
    @IsNotEmpty()
    mission: any;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    path: string;

    @IsString()
    @IsOptional()
    downloadUrl: string;

    @IsNumber()
    @IsNotEmpty()
    version: number;

    @IsString()
    @IsOptional()
    description: string;

    @IsDate()
    @IsOptional()
    createdAt: Date;

    @IsObject()
    @IsNotEmpty()
    createdBy: any;
}
