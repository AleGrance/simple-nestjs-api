import { IsString } from "class-validator"

export class ValidateUserDto {
    @IsString()
    email: string
    @IsString()
    password: string
}