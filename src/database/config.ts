import { ConfigService, registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export default registerAs('database', () => ({
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
}));

//prettier-ignore
export const sequelizeConfigFactory = (configService: ConfigService): SequelizeModuleOptions => ({
    dialect: 'mysql',
    host: 'localhost',
    port: configService.get('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    database: configService.get('database.database'),
    autoLoadModels: true,
});
