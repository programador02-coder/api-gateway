// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MicroserviceClientsModule } from './infra/clients/microservice-clients.module';
import { ProfileController } from './controllers/profile.controller';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ClassesController } from './controllers/classes.controller';
import { AuthController } from './controllers/auth.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AppController } from './controllers/app.controller';
import { SocialController } from './controllers/social.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                RMQ_URL: Joi.string().uri().required(),
                AUTH_QUEUE: Joi.string().required(),
                USERS_QUEUE: Joi.string().required(),
                LEADS_QUEUE: Joi.string().required(),
                SOCIAL_QUEUE: Joi.string().required(),
                CLASSES_QUEUE: Joi.string().required()
            }),
        }),
        MicroserviceClientsModule,
        HttpModule
    ],
    providers: [
        AppService,
        { provide: APP_FILTER, useClass: HttpErrorFilter}
    ],
    controllers: [
        ProfileController,
        ClassesController,
        AuthController,
        AppController,
        SocialController
    ],
    exports: [AppService]
})
export class AppModule {}
