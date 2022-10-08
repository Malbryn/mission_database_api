import { AbstractDto } from '../../common/abstract.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatusDto extends AbstractDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
