import { IsNotEmpty, IsString } from 'class-validator';
import { AbstractDto } from '../../common/abstract.dto';

export class CreateDlcDto extends AbstractDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
