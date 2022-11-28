import { AbstractDto } from '../../common/abstract.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends AbstractDto {
    @IsBoolean()
    @IsNotEmpty()
    isMember: boolean;

    @IsBoolean()
    @IsNotEmpty()
    isCreator: boolean;

    @IsBoolean()
    @IsNotEmpty()
    isStaff: boolean;
}
