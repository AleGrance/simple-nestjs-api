import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/models/role.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {}

  async create(role: CreateRoleDto): Promise<Role> {
    try {
      return await this.roleModel.create(role);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'El nombre de rol ingresado ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll();
  }

  async findOne(id: number): Promise<Role> {
    const roleFound = await this.roleModel.findOne({
      where: {
        id,
      },
    });

    if (!roleFound) {
      throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
    }

    return roleFound;
  }

  async update(id: number, role: UpdateRoleDto): Promise<HttpException> {
    const roleFound = await this.findOne(id);

    if (!roleFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      await this.roleModel.update(role, {
        where: {
          id,
        },
      });

      return new HttpException('Rol actualizado correctamente', HttpStatus.OK);

    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async remove(id: number): Promise<HttpException> {
    const roleFound = await this.findOne(id);

    if (!roleFound) {
      throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      await roleFound.destroy();
      return new HttpException('Rol elimiando correctamente', HttpStatus.OK);
    } catch (error) {
      throw new HttpException('Error interno', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
