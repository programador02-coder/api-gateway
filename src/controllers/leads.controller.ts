import { Controller, All, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('leads')
export class LeadsProxyController {
  private readonly baseUrl = process.env.LEADS_SERVICE_URL || 'http://localhost:3011';

  constructor(private readonly httpService: HttpService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    try {
      const downstreamPath = req.originalUrl.replace(/^\/api\/leads/, '/leads');
      const targetUrl = `${this.baseUrl}${downstreamPath}`;

      const headers = Object.fromEntries(
        Object.entries(req.headers).filter(([key]) => !['host', 'connection'].includes(key.toLowerCase())),
      );
      const data = ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined;

      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: targetUrl,
          data,
          headers,
          responseType: 'json',
          validateStatus: () => true,
        }),
      );

      res.set(response.headers as Record<string, string>);
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error('❌ Proxy leads error:', error.message);
      return res.status(error.response?.status || 500).json({
        message: 'Erro ao redirecionar requisição para leads-service',
        error: error.response?.data || error.message,
      });
    }
  }
}
