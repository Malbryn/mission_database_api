import { AbstractDto } from '../../common/abstract.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFrameworkDto extends AbstractDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    link: string;
}
