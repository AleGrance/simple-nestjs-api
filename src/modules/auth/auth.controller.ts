import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateUserDto } from '../users/dto/validate-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() validateUserDto: ValidateUserDto) {
    return this.authService.signIn(validateUserDto);
  }
}
