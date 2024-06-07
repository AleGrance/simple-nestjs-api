// src/users/user.model.ts
import { Column, Model, Table, DataType, BelongsToMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Role } from './role.model';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @BelongsToMany(() => Role, 'UserRoles', 'userId', 'roleId')
  roles: Role[];

  /**
   * Encriptar la contraseña del usuario antes de insertar en la tabla
   * @param user 
   */
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
}
