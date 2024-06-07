import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

// User model
import { ValidateUserDto } from './dto/validate-user.dto';
import { User } from 'src/models/user.model';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    try {
      return await this.userModel.create(user);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El email ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User> {
    const userFound = await this.userModel.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    
    return userFound
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<HttpException> {
    const userFound = await this.findOne(id);

    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.name) {
      userFound.name = updateUserDto.name;
    }

    if (updateUserDto.email) {
      userFound.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      userFound.password = updateUserDto.password;
    }

    try {
      userFound.save();
      return new HttpException('Usuario actualizado correctamente', HttpStatus.OK);
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async remove(id: number): Promise<HttpException> {
    const userFound = await this.findOne(id);

    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      await userFound.destroy();
      return new HttpException('Usuario elimiando correctamente', HttpStatus.OK);
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  /**
   * Validar que el usuario exista y validar la contraseña
   * @param validateUserDto
   * @returns "Acceso correcto" || "Contraseña incorrecta" || "El usuario no existe"
   */
  async validateUser(validateUserDto: ValidateUserDto): Promise<string> {
    const { email, password } = validateUserDto;

    console.log(email, password);

    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return 'Acceso correcto';
      } else {
        throw new HttpException(
          'Contraseña incorrecta',
          HttpStatus.BAD_REQUEST,
        );
        // return 'Contraseña incorrecta';
      }
    }

    throw new HttpException('El usuario no existe', HttpStatus.BAD_REQUEST);
  }
}
