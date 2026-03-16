import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Security
    app.use(helmet());
    app.use(cookieParser(process.env.COOKIE_SECRET));

    // CORS
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
        credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix(process.env.API_PREFIX || 'api');

    // Global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('NEXURA API')
        .setDescription('Behavioral Intelligence System API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management endpoints')
        .addTag('health', 'Health check endpoints')
        .addTag('habits', 'Habits management endpoints')
        .addTag('goals', 'Goals management endpoints')
        .addTag('expenses', 'Expenses management endpoints')
        .addTag('analytics', 'Analytics and timeline endpoints')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`
  🚀 NEXURA Backend is running!
  📝 API: http://localhost:${port}/api
  📚 Docs: http://localhost:${port}/api/docs
  🔧 Environment: ${process.env.NODE_ENV}
  `);
}

bootstrap();
