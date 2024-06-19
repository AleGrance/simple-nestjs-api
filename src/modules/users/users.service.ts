import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

// User model
import { ValidateUserDto } from './dto/validate-user.dto';
import { User } from 'src/models/user.model';
import { NotFoundError } from 'rxjs';
import { FilterUserDto } from './dto/filter-user.dto';

// Seque
import { Op } from 'sequelize';
import { FilteredUserDto } from './dto/filtered-user.dto';

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
    return this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async findOne(id: number): Promise<User> {
    const userFound = await this.userModel.findOne({
      where: {
        id,
      },
      attributes: { exclude: ['password'] },
    });

    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<HttpException> {
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
      return new HttpException(
        'Usuario actualizado correctamente',
        HttpStatus.OK,
      );
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
      return new HttpException(
        'Usuario elimiando correctamente',
        HttpStatus.OK,
      );
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

  async findAllFiltered(filterUserDto: FilterUserDto): Promise<FilteredUserDto> {
    try {
      var search_keyword = filterUserDto.search.value
        .replace(/[^a-zA-Z 0-9.]+/g, '')
        .split(' ');

      const counts = await this.userModel.count();

      var condition = [];

      for (var searchable of search_keyword) {
        if (searchable !== '') {
          condition.push({
            name: {
              [Op.iLike]: `%${searchable}%`,
            },
          });
        }
      }

      var result = {
        data: [],
        recordsTotal: 0,
        recordsFiltered: 0,
      };

      if (!counts) {
        return result;
      }

      result.recordsTotal = counts;

      const response = await this.userModel.findAndCountAll({
        offset: filterUserDto.start,
        limit: filterUserDto.length,
        where: {
          [Op.or]:
            condition.length > 0 ? condition : [{ name: { [Op.iLike]: '%%' } }],
        },
        attributes: {
          exclude: ['password'],
        },
        order: [['name', 'DESC']],
      });

      result.recordsFiltered = response.count;
      result.data = response.rows;
      return result;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
