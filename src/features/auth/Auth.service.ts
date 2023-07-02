import { Injectable, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleUser, User } from 'src/model';
import { LoginDTO, RegisterDTO, UserCredentials } from './dto';
import { JwtService } from '@nestjs/jwt/dist';
import * as bcrypt from 'bcrypt';
import * as RoleRepository from 'src/repositories/Role.repository';
import { encryptToken } from 'src/libs/encryptionHelper';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private UserModel: typeof User,
        @InjectModel(RoleUser) private RoleUserModel: typeof RoleUser,
        private jwt: JwtService,
    ) {
        this.RoleUserModel.removeAttribute('id');
    }

    private readonly logger = new Logger(AuthService.name);

    async register(user: RegisterDTO): Promise<object> {
        try {
            await this.findEmail(user.email);
            await this.createUser(user);
            this.logger.log(`New user registered with email ${user.email}`);
            return {
                statusCode: HttpStatus.CREATED,
                message: `Registration Success ${user.email}!`,
            };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async login(user: LoginDTO): Promise<object> {
        try {
            const credentials = await this.UserModel.findOne({
                where: { email: user.email },
            });
            if (!credentials) {
                throw new HttpException('Credentials Incorrect', 403);
            }
            await this.verifyPassword(user.password, credentials.password);
            return this.createToken(credentials);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * List of all private function
     * @private function
     */

    private async findEmail(email: string): Promise<void> {
        const existingEmail = await this.UserModel.findOne({
            where: { email },
        });
        if (existingEmail) {
            throw new HttpException('Email already exists', 403);
        }
    }

    private async createUser(user: RegisterDTO): Promise<void> {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(user.password, salt);
        const createdUser = await this.UserModel.create({ ...user, password });
        await this.RoleUserModel.create({
            role_id: user.role_id,
            user_id: createdUser.id,
        });
    }

    // prettier-ignore
    private async verifyPassword(userPassword: string, credentialsPasswod: string): Promise<void> {
        const matchedPassword = await bcrypt.compare(
            userPassword,
            credentialsPasswod,
        );
        if (!matchedPassword) {
            throw new HttpException('Password Incorrect', 403);
        }
    }

    private async createToken(credentials : UserCredentials): Promise<object> {
        const roleDetail = await RoleRepository.getRoleName(credentials);
        const payload = {
            email: credentials.email,
            role: roleDetail.role,
            id_role: roleDetail.id_role,
        };
        const accessToken = await this.jwt.signAsync(payload);
        const encryptedToken = encryptToken(accessToken);
        this.logger.log(`User with email ${credentials.email} has logged in`);
        return { accessToken: encryptedToken };
    }
}
