import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe());

  app.useLogger(new Logger());

  // If development mode is enabled, Swagger documentation is available at http://localhost:8080/swagger
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Vehicle register')
      .setDescription('The vehicle register API description')
      .setVersion('1.0')
      .addTag('vehicles')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  console.log(`Listening on port ${process.env.PORT}`);

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
