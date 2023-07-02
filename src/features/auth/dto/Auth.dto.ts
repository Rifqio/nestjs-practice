import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    Validate,
} from 'class-validator';
import { RoleIdValidator } from 'src/libs/extraValidator';

export class RegisterDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNumber()
    @IsNotEmpty()
    @Validate(RoleIdValidator)
    role_id: number;
}

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export interface UserCredentials {
    name: string;
    email: string;
    password: string;
}

export interface RoleData {
    role: string;
    id_role: number;
}

export interface AuthPayload {
    user : {
        email : string,
        role: string,
        id_role: number
    }
}
