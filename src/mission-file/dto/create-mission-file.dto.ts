import { AbstractDto } from '../../common/abstract.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMissionFileDto extends AbstractDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    missionId: number;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    path: string;

    @IsString()
    @IsOptional()
    downloadUrl: string;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    version: number;

    @IsString()
    @IsOptional()
    description: string;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    createdById: any;
}
