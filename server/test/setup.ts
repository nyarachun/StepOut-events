import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module.js';

export async function createTestApp() {
  const moduleFixture: TestingModule =
    await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

  const app: INestApplication =
    moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.init();

  return app;
}