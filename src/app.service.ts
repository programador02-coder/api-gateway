// src/app.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout, retry, catchError, throwError } from 'rxjs';

type ServiceKey = 'auth' | 'leads' | 'social' | 'users' | 'classes';

@Injectable()
export class AppService {
    private readonly clients: Record<ServiceKey, ClientProxy>;

    constructor(
        @Inject('AUTH_SERVICE')    private readonly authService: ClientProxy,
        @Inject('LEADS_SERVICE')   private readonly leadsService: ClientProxy,
        @Inject('SOCIAL_SERVICE')  private readonly socialService: ClientProxy,
        @Inject('USERS_SERVICE')   private readonly usersService: ClientProxy,
        @Inject('CLASSES_SERVICE') private readonly classesService: ClientProxy
    ) {
        this.clients = {
            auth: this.authService,
            leads: this.leadsService,
            social: this.socialService,
            users: this.usersService,
            classes: this.classesService
        };
    }

    async send<T = any>(
        service: ServiceKey,
        cmd: string,
        payload: unknown = {},
        opts: { timeoutMs?: number; retries?: number } = {},
    ): Promise<T> {
        const client = this.clients[service];
        if (!client) throw new Error(`Serviço ${service} não encontrado`);

        const t = opts.timeoutMs ?? 30000;
        const r = opts.retries ?? 2;

        const obs$ = client
        .send<T>({ cmd }, payload)
        .pipe(
            timeout(t),
            retry(r),
            catchError((err) =>
                throwError(() => ({
                    statusCode: err?.status || 502,
                    message: err?.message || `Erro ao chamar ${service}.${cmd}`,
                    service,
                    cmd,
                })),
            ),
        );

        return lastValueFrom(obs$);
    }
}
