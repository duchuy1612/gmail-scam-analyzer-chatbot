"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Gmail Scam Analyzer API')
        .setDescription('API for analyzing Gmail messages for potential scams using AI-powered detection')
        .setVersion('1.0')
        .addTag('health', 'Health check endpoints')
        .addTag('auth', 'Authentication endpoints')
        .addTag('emails', 'Email analysis endpoints')
        .addTag('chat', 'Chat interface endpoints')
        .addServer('http://localhost:3001', 'Development server')
        .addServer('https://api.gmail-scam-analyzer.com', 'Production server')
        .addBearerAuth({
        description: 'JWT Authorization header using the Bearer scheme.',
        name: 'Authorization',
        bearerFormat: 'JWT',
        scheme: 'bearer',
        type: 'http',
        in: 'Header'
    }, 'access-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
//# sourceMappingURL=main.js.map