import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

// User model
import { ValidateUserDto } from './dto/validate-user.dto';
import { User } from 'src/models/user.model';
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

  async create(user: CreateUserDto): Promise<HttpException> {
    try {
      await this.userModel.create(user);

      return new HttpException('Usuario creado correctamente', HttpStatus.OK);
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
        userId: id,
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

    // Comparar los valores proporcionados con los valores actuales
    const hasChanges = ['name', 'email', 'password'].some((key) => {
      return updateUserDto[key] && updateUserDto[key] !== userFound[key];
    });

    if (!hasChanges) {
      throw new HttpException(
        'Ningún campo ha cambiado',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Actualizar los valores directamente en el modelo
      if (updateUserDto.name) {
        userFound.name = updateUserDto.name;
      }
      if (updateUserDto.email) {
        userFound.email = updateUserDto.email;
      }
      if (updateUserDto.password) {
        userFound.password = updateUserDto.password;
      }

      // Guardar el usuario con los nuevos valores, disparando los hooks
      await userFound.save();

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
  // async validateUser(validateUserDto: ValidateUserDto): Promise<any> {
  //   const { email, password } = validateUserDto;

  //   const user = await this.userModel.findOne({
  //     where: {
  //       email,
  //     },
  //   });

  //   if (user) {
  //     if (await bcrypt.compare(password, user.password)) {
  //       return user;
  //     } else {
  //       throw new HttpException(
  //         'Contraseña incorrecta',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   }

  //   throw new HttpException('El usuario no existe', HttpStatus.BAD_REQUEST);
  // }

  async findAllFiltered(
    filterUserDto: FilterUserDto,
  ): Promise<FilteredUserDto> {
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
