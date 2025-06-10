import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Gmail Scam Analyzer API')
    .setDescription('API for analyzing Gmail messages for potential scams using AI-powered detection')
    .setVersion('1.0')
    .addTag('health', 'Health check endpoints')
    .addTag('auth', 'Authentication endpoints')
    .addTag('emails', 'Email analysis endpoints')
    .addTag('chat', 'Chat interface endpoints')
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.gmail-scam-analyzer.com', 'Production server')
    .addBearerAuth(
      {
        description: 'JWT Authorization header using the Bearer scheme.',
        name: 'Authorization',
        bearerFormat: 'JWT',
        scheme: 'bearer',
        type: 'http',
        in: 'Header'
      },
      'access-token'
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Gmail Scam Analyzer API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  await app.listen(3001);
  console.log(`Application is running on: http://localhost:3001`);
  console.log(`Swagger documentation available at: http://localhost:3001/api/docs`);
}
bootstrap();
