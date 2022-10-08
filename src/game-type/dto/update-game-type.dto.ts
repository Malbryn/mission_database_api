import { AbstractDto } from '../../common/abstract.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGameTypeDto extends AbstractDto {
    @IsString()
    @IsOptional()
    name?: string;
}
