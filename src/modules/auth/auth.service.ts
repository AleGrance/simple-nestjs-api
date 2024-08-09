import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidateUserDto } from '../users/dto/validate-user.dto';
import { User } from 'src/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  /**
   * Validar que el usuario exista y validar la contraseña
   * @param validateUserDto
   * @returns "Acceso correcto" || "Contraseña incorrecta" || "El usuario no existe"
   */
  async validateUser(validateUserDto: ValidateUserDto): Promise<any> {
    const { email, password } = validateUserDto;

    const user = await this.userModel.findOne({
      where: {
        email,
      }
    });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return user;
      } else {
        throw new HttpException(
          'Contraseña incorrecta',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    throw new HttpException('El usuario no existe', HttpStatus.BAD_REQUEST);
  }

  // Genera y retorna el token
  async signIn(validateUserDto: ValidateUserDto): Promise<any> {
    const user = await this.validateUser(validateUserDto);

    const payload = { sub: user.userId, username: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
