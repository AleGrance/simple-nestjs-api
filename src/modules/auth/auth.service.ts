import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ValidateUserDto } from '../users/dto/validate-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signIn(validateUserDto: ValidateUserDto): Promise<any> {
    const user = await this.usersService.validateUser(validateUserDto);

    const payload = { sub: user.userId, username: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
