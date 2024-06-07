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
        throw new HttpException("El nombre de rol ingresado ya existe", HttpStatus.BAD_REQUEST);
      }
    }
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll();
  }

  async findOne(id: number): Promise<Role> {
    return this.roleModel.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, role: UpdateRoleDto): Promise<void> {
    await this.roleModel.update(role, {
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await role.destroy();
  }
}
