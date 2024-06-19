import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class FilteredUserDto {
  @IsNotEmpty()
  data: CreateUserDto[];
  @IsNumber()
  recordsTotal: number;
  @IsNumber()
  recordsFiltered: number;
}
