import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { LoginDTO, RegisterDTO } from './dto';
import { Public } from 'src/libs/decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Public()
    @Post('register')
    async register(@Body() user: RegisterDTO) {
        return this.authService.register(user);
    }

    @Public()
    @HttpCode(200)
    @Post('login')
    async login(@Body() user: LoginDTO) {
        return this.authService.login(user);
    }
}
