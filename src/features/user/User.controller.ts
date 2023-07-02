import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
import { UserService } from './User.service';
import { UserDTO } from './dto';
import { AuthPayload } from '../auth/dto';

@Controller('users')
export class UserController {
    constructor(private UserService: UserService) {}

    @Get()
    async getAllUser(@Req() req : AuthPayload) {
        console.log(req.user.email);
        return await this.UserService.findAll();
    }

    @Get(':id')
    async getOneUser(@Param('id') id: number) {
        return await this.UserService.findOne(id);
    }

    @Post()
    async addOneUser(@Body() user: UserDTO) {
        return await this.UserService.addUser(user);
    }
}
