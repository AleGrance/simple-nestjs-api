import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateRoleDto {
    @IsString({ message: 'El campo name debe ser un string' })
    @IsNotEmpty({ message: 'El campo name no debe estar vacío' })
    @MinLength(4, {
      message: 'El campo name debe contener al menos 4 caracteres',
    })
  name: string;
}
