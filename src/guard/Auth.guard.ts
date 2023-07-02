import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { decryptToken } from 'src/libs/encryptionHelper';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            // For public routes first
            const isPublic = this.reflector.get<boolean>(
                'isPublic',
                context.getHandler(),
            );
            if (isPublic) {
                return true;
            }

            // For private routes
            const request = context.switchToHttp().getRequest();
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new UnauthorizedException();
            }
            const decryptedToken = decryptToken(token);
            const payload = await this.jwt.verifyAsync(decryptedToken, {
                secret: this.config.get('JWT_SECRET'),
            });
            request['user'] = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string {
        const authHeader = request.headers.authorization;
        const token = authHeader.split(' ')[1];
        return token;
    }
}

