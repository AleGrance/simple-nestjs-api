import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

// User model
import { User } from './user.model';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    return this.userModel.create(user);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, user: UpdateUserDto): Promise<void> {
    await this.userModel.update(user, {
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  // Validar que el usuario exista y validar la contraseña
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
        return 'Contraseña incorrecta';
      }
    }

    return 'El usuario no existe';
  }
}
