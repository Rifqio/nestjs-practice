import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './features/user/User.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './features/auth/Auth.module';
import databaseConfig, { sequelizeConfigFactory } from './database/config';
import { LoggerMiddleware } from './middleware/Logger.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: sequelizeConfigFactory,
            inject: [ConfigService],
        }),
        UserModule,
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
