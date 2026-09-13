import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import nodemailer, {
  Transporter,
} from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter =
      nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
  }

  async sendVerificationCode(
    email: string,
    code: string,
  ) {
    try {
      await this.transporter.sendMail({
        from: `StepOut <${process.env.MAIL_USER}>`,
        to: email,
        subject:
          'StepOut email verification',
        text: `
Welcome to StepOut!

Your verification code is:

${code}

This code expires in 10 minutes.

If you did not create a StepOut account, you can ignore this email.
        `.trim(),
      });
    } catch (error) {
      console.error(
        'Failed to send verification email',
        error,
      );

      throw new InternalServerErrorException(
        'Could not send verification email',
      );
    }
  }
}