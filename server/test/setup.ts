import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module.js';
import { EmailVerificationService } from '../src/auth/email-verification.service.js';
import { MailService } from '../src/auth/mail.service.js';

export async function createTestApp() {
  const moduleFixture: TestingModule =
    await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useFactory({
        inject: [EmailVerificationService],
        factory: (emailVerificationService: EmailVerificationService) => ({
          sendVerificationCode: async (email: string, code: string) => {
            emailVerificationService.verifyCode(email, code);
          },
        }),
      })
      .compile();

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