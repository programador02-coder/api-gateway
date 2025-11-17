import { Controller, All, Req, Res } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private readonly httpService: HttpService) {}

    @All('*path')
    async proxy(@Req() req: Request, @Res() res: Response) {
        try {
            // Target URL do serviço downstream
            const target_url = `http://localhost:3010${req.originalUrl}`;
            console.log(`🔁 Proxying request to`);

            // Converte headers do Express para formato compatível com Axios
            const headers = Object.fromEntries(
                Object.entries(req.headers)
                .filter(([k]) => !['host', 'connection'].includes(k.toLowerCase()))
                .map(([k, v]) => [k, v as string])
            );

            // Só envia body se o método aceitar
            const data = ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined;

            console.log({
                method: req.method,
                url: target_url,
                data,
                headers,
                responseType: 'json'
            })

            console.log(await this.httpService.request({
                method: req.method,
                url: target_url,
                data,
                headers,
                responseType: 'json',
            }))

            // Chamada HTTP para o serviço downstream
            const { data: responseData, status, headers: responseHeaders } = await firstValueFrom(
                this.httpService.request({
                    method: req.method,
                    url: target_url,
                    data,
                    headers,
                    responseType: 'json',
                })
            );
            console.log('asdadsa')

            // Envia headers de volta pro client
            res.set(responseHeaders as Record<string, string>);

            // Retorna a resposta
            return res.status(status).json(responseData);

        } catch (err: any) {
            console.error('❌ Proxy error:', err.message, err.response?.data);

            return res.status(err.response?.status || 500).json({
                message: `Erro ao redirecionar requisição para auth-service`,
                error: err.response?.data || err.message,
            });
        }
    }
}