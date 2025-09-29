// src/infra/clients/microservice-clients.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { createRmqClient } from './rmq-client.factory';

@Module({
    providers: [
        {
            provide: 'AUTH_SERVICE',
            useFactory: (cfg: ConfigService): ClientProxy =>
                createRmqClient(cfg.get<string>('RMQ_URL')!, cfg.get<string>('AUTH_QUEUE')!),
            inject: [ConfigService],
        },
        {
            provide: 'USERS_SERVICE',
            useFactory: (cfg: ConfigService): ClientProxy =>
                createRmqClient(cfg.get<string>('RMQ_URL')!, cfg.get<string>('USERS_QUEUE')!),
            inject: [ConfigService],
            
        },
        {
            provide: 'LEADS_SERVICE',
            useFactory: (cfg: ConfigService): ClientProxy =>
                createRmqClient(cfg.get<string>('RMQ_URL')!, cfg.get<string>('LEADS_QUEUE')!),
            inject: [ConfigService],
        },
        {
            provide: 'SOCIAL_SERVICE',
            useFactory: (cfg: ConfigService): ClientProxy =>
                createRmqClient(cfg.get<string>('RMQ_URL')!, cfg.get<string>('SOCIAL_QUEUE')!),
            inject: [ConfigService],
        },
        {
            provide: 'CLASSES_SERVICE',
            useFactory: (cfg: ConfigService): ClientProxy =>
                createRmqClient(cfg.get<string>('RMQ_URL')!, cfg.get<string>('CLASSES_QUEUE')!),
            inject: [ConfigService],
        },
    ],
    exports: ['AUTH_SERVICE', 'USERS_SERVICE', 'LEADS_SERVICE', 'SOCIAL_SERVICE', 'CLASSES_SERVICE'],
})
export class MicroserviceClientsModule {}
