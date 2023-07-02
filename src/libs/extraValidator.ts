import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'custom', async: false })
export class RoleIdValidator implements ValidatorConstraintInterface {
    validate(roleId: number) {
        return roleId !== 1; 
    }
    
    defaultMessage() {
        return `This role is forbidden`;
    }
};