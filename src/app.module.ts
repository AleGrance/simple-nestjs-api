import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
// Sequelize
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { Role } from './roles/role.model';
import { UserRoles } from './user-roles/user-roles.model';
import { UserRolesModule } from './user-roles/user-roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno sean globales
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      models: [User, Role, UserRoles],
    }),
    UsersModule,
    RolesModule,
    UserRolesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
