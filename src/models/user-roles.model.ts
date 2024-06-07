import { Column, Model, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Role } from '../roles/role.model';

@Table
export class UserRoles extends Model<UserRoles> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId: number;
}