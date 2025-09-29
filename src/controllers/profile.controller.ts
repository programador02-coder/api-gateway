// src/controllers/profile.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('profile') 
export class ProfileController {
    constructor(private readonly appService: AppService) {}

    @Get('overview')
    async profile() {
        console.log('Teste')
        const [feed, profile] = await Promise.all([
            this.appService.send('users', 'users.profile', { userId: 1 }, { timeoutMs: 2500 }),
            this.appService.send('users', 'users.posts', { userId:1, limit: 10, page: 1 }, { timeoutMs: 2500 }),
        ]);

        return { userId: 1, feed, profile };
    }
}
