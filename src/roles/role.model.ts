// src/roles/role.model.ts
import { Column, Model, Table, DataType, BelongsToMany } from 'sequelize-typescript';
import { User } from 'src/users/user.model';

@Table
export class Role extends Model<Role> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => User, 'UserRoles', 'roleId', 'userId')
  users: User[];
}
