import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Role, User } from './index';
@Table({ tableName: 'role_user', timestamps: false })
export class RoleUser extends Model {
    @Column
    @ForeignKey(() => Role)
    role_id: number;

    @Column
    @ForeignKey(() => User)
    user_id: number;

    @BelongsTo(() => Role, 'role_id')
    role: Role;

    @BelongsTo(() => User, 'user_id')
    user: User;
}
