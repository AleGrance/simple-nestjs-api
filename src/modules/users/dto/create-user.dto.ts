import { IsNotEmpty, IsString, MinLength } from "class-validator"
import { Role } from "src/models/role.model"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    name: string

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    password: string
    roles?: Role[]
}
