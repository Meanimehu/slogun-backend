import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parser
  app.use(cookieParser());

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        // Format validation errors
        const messages = errors.map((error) => {
          if (error.constraints) {
            return {
              property: error.property,
              constraints: error.constraints,
            };
          }
          return `${error.property} is invalid`;
        });

        return new HttpException(
          { message: messages, error: 'Bad Request' },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  // Global Interceptor (wraps success responses)
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Filter (formats error responses)
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Slogun Api')
    .setDescription('Protest Slogan Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:5000/api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // ← Add this!
      docExpansion: 'none',
    },
  });

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`🚀 Swagger running on http://localhost:${port}/api/docs`);
}
bootstrap();
