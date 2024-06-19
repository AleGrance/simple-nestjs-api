import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FilterUserDto {
  @IsNotEmpty()
  search: {
    value: string;
  };

  @IsNumber()
  start: number;
  @IsNumber()
  length: number;
}
