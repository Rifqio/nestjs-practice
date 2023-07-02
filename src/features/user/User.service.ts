import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../model/User.model';
import { UserDTO } from './dto';
@Injectable()
export class UserService {
    constructor(@InjectModel(User) private UserModel: typeof User) {}

    async findAll(): Promise<User[]> {
        try {
            const userData = await this.UserModel.findAll();
            return userData;
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: number): Promise<User> {
        try {
            const userData = await this.UserModel.findByPk(id);
            if (!userData) {
                throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
            }
            return userData;
        } catch (error) {
            throw error;
        }
    }

    async addUser(user: UserDTO): Promise<object> {
        try {
            const { name, email, password } = user;

            const findEmail = await this.UserModel.findOne({
                where: { email },
            });

            if (findEmail) {
                throw new HttpException('Email already exist', 400);
            }

            const userData = await this.UserModel.create({
                name,
                email,
                password,
            });

            return {
                message: 'User succesfully created',
                data: userData.email,
            };
        } catch (error) {
            throw error;
        }
    }
}
