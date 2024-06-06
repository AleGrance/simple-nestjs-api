import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRoles } from './user-roles.model';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectModel(UserRoles)
    private userRolesModel: typeof UserRoles,
  ) {}

  async addRoleToUser(userId: number, roleId: number): Promise<UserRoles> {
    return this.userRolesModel.create({ userId, roleId });
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await this.userRolesModel.destroy({ where: { userId, roleId } });
  }

  async findRolesByUser(userId: number): Promise<UserRoles[]> {
    return this.userRolesModel.findAll({ where: { userId } });
  }

  async findUsersByRole(roleId: number): Promise<UserRoles[]> {
    return this.userRolesModel.findAll({ where: { roleId } });
  }
}