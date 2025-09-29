// src/common/guards/jwt-remote.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AppService } from 'src/app.service';

type AuthValidateResponse = { isValid: boolean; userId: string }

@Injectable()
export class JwtRemoteGuard implements CanActivate {
    constructor(private readonly gw: AppService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<Request & { user?: any }>();
        const auth = (req.headers['authorization'] || '') as string;
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

        if (!token) throw new UnauthorizedException('Token ausente');

        const res = await this.gw.send<AuthValidateResponse>('auth', 'auth.validate', { token });
        if (!res?.isValid) throw new UnauthorizedException('Token inválido');

        // anexa o user ao request para os controllers
        (req as any).user = { id: res.userId };
        return true;
    }
}
