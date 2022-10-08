import { AbstractDto } from '../../common/abstract.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMapDto extends AbstractDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    worldName?: string;
}
