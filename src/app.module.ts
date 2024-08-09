import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
// Modules
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
// Sequelize
import { SequelizeModule } from '@nestjs/sequelize';
// Models
import { User } from './models/user.model';
import { Role } from './models/role.model';
import { UserRoles } from './models/user-roles.model';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { jwtConstants } from './modules/auth/constants';

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
    UserRolesModule,
    AuthModule
  ],
  controllers: [AppController, AuthController],
  providers: [
    // { provide: APP_GUARD, useClass: AuthGuard },
    AppService,
    AuthService,
    {
      provide: 'UserRepository',
      useValue: User,
    },
  ],
})
export class AppModule {}
