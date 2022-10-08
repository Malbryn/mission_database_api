import { AbstractDto } from '../../common/abstract.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateModsetDto extends AbstractDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
