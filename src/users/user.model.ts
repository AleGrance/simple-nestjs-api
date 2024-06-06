// src/users/user.model.ts
import { Column, Model, Table, DataType, BelongsToMany } from 'sequelize-typescript';
import { Role } from 'src/roles/role.model';

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
}
