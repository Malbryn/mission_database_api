import { AbstractDto } from '../../common/abstract.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMapDto extends AbstractDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    worldName: string;
}
