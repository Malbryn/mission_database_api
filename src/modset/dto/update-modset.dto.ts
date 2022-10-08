import { AbstractDto } from '../../common/abstract.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateModsetDto extends AbstractDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    url?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
