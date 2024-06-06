import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './role.model';
import { UserRoles } from 'src/user-roles/user-roles.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, UserRoles])],
  exports: [RolesService],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
