import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
@Table({ tableName: 'roles', timestamps: false })
export class Role extends Model {
    @PrimaryKey
    @Column
    id_role: number;

    @Column
    role: string;
}
