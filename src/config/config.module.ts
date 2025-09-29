// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

/**
 * Configurações de Enviroment(.env)
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                PORT: Joi.number().default(4000),
                RMQ_URL: Joi.string().uri().required(),
                AUTH_QUEUE: Joi.string().default('auth_queue'),
                USERS_QUEUE: Joi.string().default('users_queue'),
                LEADS_QUEUE: Joi.string().default('leads_queue'),
                SOCIAL_QUEUE: Joi.string().default('social_queue'),
            }),
        }),
    ],
})
export class AppConfigModule {}
