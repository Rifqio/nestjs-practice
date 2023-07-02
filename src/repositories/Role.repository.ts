import { RoleData } from 'src/features/auth/dto';
import { Role, RoleUser } from 'src/model';

export const getRoleName = async (user: any): Promise<RoleData> => {
    const roleId = await getRoleId(user.id);
    const role = await Role.findOne({
        where: { id_role: roleId },
    });
    return { role: role.role, id_role: role.id_role };
};

const getRoleId = async (userId: number): Promise<number> => {
    const roleId = await RoleUser.findOne({
        where: { user_id: userId },
    });
    return roleId.role_id;
};
