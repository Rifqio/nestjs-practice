import { Module } from '@nestjs/common';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../model/User.model';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../guard/Auth.guard';

@Module({
    imports: [SequelizeModule.forFeature([User]), JwtModule],
    controllers: [UserController],
    providers: [UserService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class UserModule {}
