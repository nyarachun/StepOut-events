import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/exception.filter.js';
import { AppModule } from './app.module.js';

async function start() {
  const PORT = Number(process.env.PORT) || 5000;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://nyarachun.github.io',
    ]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT);

  console.log(`Server started on port ${PORT}`);
}

start();
