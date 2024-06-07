import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Role } from 'src/models/role.model';

/**
 * DTOs validators
 */

export class CreateUserDto {
  @IsString({ message: 'El campo name debe ser un string' })
  @IsNotEmpty({ message: 'El campo name no debe estar vacío' })
  @MinLength(4, {
    message: 'El campo name debe contener al menos 4 caracteres',
  })
  name: string;

  @IsEmail(undefined, {
    message: 'El campo email debe contener una dirección válida',
  })
  @IsString({ message: 'El campo email debe ser un string' })
  @IsNotEmpty({ message: 'El campo email no debe estar vacío' })
  @MinLength(4, {
    message: 'El campo email debe contener al menos 4 caracteres',
  })
  email: string;

  @IsNotEmpty({ message: 'El campo password no debe estar vacío' })
  @MinLength(4, {
    message: 'El campo password debe contener al menos 4 caracteres',
  })
  @IsStrongPassword(
    {
      minLength: 4,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message: 'El campo password debe tener al menos 4 caracteres y 1 número',
    },
  )
  password: string;
  roles?: Role[];
}
