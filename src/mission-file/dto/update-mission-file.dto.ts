import { AbstractDto } from '../../common/abstract.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMissionFileDto extends AbstractDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    missionId: number;
}
