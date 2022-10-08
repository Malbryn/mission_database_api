import { AbstractDto } from '../../common/abstract.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDlcDto extends AbstractDto {
    @IsString()
    @IsOptional()
    name?: string;
}
