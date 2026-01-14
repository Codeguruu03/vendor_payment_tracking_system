import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors();
  // Set global API prefix
  app.setGlobalPrefix('api');


  // Global validation pipe with detailed error messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter for standardized error responses
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Vendor Payment Tracking API')
    .setDescription(`
      MSME Vendor Payment Tracking System API
      
      ## Features
      - Vendor Management (CRUD)
      - Purchase Order Management with Line Items
      - Payment Recording with Transaction Support
      - Analytics (Outstanding & Aging Reports)
      
      ## Authentication
      Use the /auth/login endpoint to get a JWT token, then click "Authorize" and enter: Bearer <token>
      
      **Test Credentials:**
      - Username: admin | Password: admin123
      - Username: user | Password: user123
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Vendors', 'Vendor management')
    .addTag('Purchase Orders', 'Purchase order management')
    .addTag('Payments', 'Payment recording')
    .addTag('Analytics', 'Reports and analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger docs available at: http://localhost:${port}/api`);
}
bootstrap();
