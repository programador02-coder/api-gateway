// src/controllers/classes.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('classes') 
export class ClassesController {
    constructor(private readonly appService: AppService) {}

    @Get('list-levels')
    async handleLevels() {
        console.log('Levels')
        const [ levels ] = await Promise.all([
            this.appService.send('classes', 'modules.list', { userId: 1 }, { timeoutMs: 2500 }),
        ]);

        return { 
            data: {
                userId: 1,
                levels
            }
        };
    }

    @Get('list-courses')
    async handleListCourses(@Query('level_id') level_id: string) {
        console.log('Buscando Cursos')
        console.log('Level',level_id)
        const [ courses, level ] = await Promise.all([
            this.appService.send('classes', 'courses.list', { userId: 1 }, { timeoutMs: 2500 }),
            this.appService.send('classes', 'modules.view', {level_id})
        ]);

        return { 
            data: {
                userId: 1,
                courses,
                exam_id: 1,
                level
            }
        };
    }

    @Get('user-progress')
    async handleUserprogress() {
        console.log('Buscando Progresso do Usuario')
        const [ progress, levels ] = await Promise.all([
            this.appService.send('classes', 'courses.user-progress', { userId: 1 }, { timeoutMs: 2500 }),
            this.appService.send('classes', 'modules.list')
        ]);

        console.log(progress)

        return { 
            data: {
                userId: 1,
                progress,
                levels
            }
        };
    }
}
