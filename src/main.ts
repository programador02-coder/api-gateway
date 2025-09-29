// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.setGlobalPrefix('api')
    // app.enableVersioning({
    //     type: VersioningType.HEADER,
    //     header: "X-API-Version",
    //     defaultVersion: '1'
    // })
    // Validação dos DTOs
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));


    const PORT = process.env.PORT ?? 4000
    console.log(`Iniciando a API Atlas - Gateway na porta ${PORT} nestjs`)
    await app.listen(PORT);
}
bootstrap();
