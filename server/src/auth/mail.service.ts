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
  private readonly mailUser: string;

  constructor() {
    this.mailUser = process.env.MAIL_USER?.trim() || '';
    const mailPassword =
      process.env.MAIL_PASSWORD?.replace(/\s/g, '') || '';
    const mailHost =
      process.env.MAIL_HOST?.trim() || 'smtp.gmail.com';
    const mailPort = Number(process.env.MAIL_PORT) || 465;
    const mailSecure =
      process.env.MAIL_SECURE !== undefined
        ? process.env.MAIL_SECURE === 'true'
        : mailPort === 465;

    if (!this.mailUser || !mailPassword) {
      throw new Error(
        'MAIL_USER and MAIL_PASSWORD must be configured',
      );
    }

    this.transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailSecure,
      auth: {
        user: this.mailUser,
        pass: mailPassword,
      },
    });
  }

  async sendVerificationCode(
    email: string,
    code: string,
  ) {
    try {
      await this.transporter.sendMail({
        from: `StepOut <${this.mailUser}>`,
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
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      console.error(
        `Failed to send verification email: ${message}`,
      );

      throw new InternalServerErrorException(
        'Could not send verification email',
      );
    }
  }
}