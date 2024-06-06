import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserRoles } from 'src/user-roles/user-roles.model';

@Module({
  imports: [SequelizeModule.forFeature([User, UserRoles])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
