import { Controller, Post, Delete, Param, Body, Get, UseGuards } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { AuthGuard } from 'src/common/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  async addRoleToUser(
    @Body('userId') userId: number,
    @Body('roleId') roleId: number,
  ) {
    return this.userRolesService.addRoleToUser(userId, roleId);
  }

  @Get()
  readRoles() {
    return "This is roles..."
  }

  @Delete()
  async removeRoleFromUser(
    @Body('userId') userId: number,
    @Body('roleId') roleId: number,
  ) {
    return this.userRolesService.removeRoleFromUser(userId, roleId);
  }
}