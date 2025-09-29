// src/common/filters/http-error.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const status =
        exception instanceof HttpException
            ? exception.getStatus()
            : exception?.statusCode || HttpStatus.BAD_GATEWAY;

        const message =
            exception instanceof HttpException ? exception.message : exception?.message || 'Erro interno';

        res.status(status).json({
            statusCode: status,
            message,
            error: exception?.error || 'GatewayError',
            timestamp: new Date().toISOString(),
        });
    }
}
