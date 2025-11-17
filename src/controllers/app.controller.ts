import { Controller, All, Req, Res, Get } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";
import { Request, Response } from 'express';

@Controller('')
export class AppController {

    constructor(private readonly httpService: HttpService) {}

    @Get('/')
    async app(){


        console.log('Exibindo página normal')

        return 'Página 1'
    }
}