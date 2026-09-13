import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

type VerificationData = {
  code: string;
  expiresAt: number;
};

@Injectable()
export class EmailVerificationService {
  private readonly codes = new Map<
    string,
    VerificationData
  >();

  private readonly verifiedEmails =
    new Set<string>();

  generateCode() {
    return Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
  }

  saveCode(
    email: string,
    code: string,
  ) {
    const normalizedEmail =
      email.toLowerCase().trim();

    this.codes.set(
      normalizedEmail,
      {
        code,
        expiresAt:
          Date.now() + 10 * 60 * 1000,
      },
    );
  }

  verifyCode(
    email: string,
    code: string,
  ) {
    const normalizedEmail =
      email.toLowerCase().trim();

    const verification =
      this.codes.get(
        normalizedEmail,
      );

    if (!verification) {
      throw new BadRequestException(
        'Verification code not found or expired',
      );
    }

    if (
      Date.now() >
      verification.expiresAt
    ) {
      this.codes.delete(
        normalizedEmail,
      );

      throw new BadRequestException(
        'Verification code has expired',
      );
    }

    if (
      verification.code !== code
    ) {
      throw new BadRequestException(
        'Invalid verification code',
      );
    }

    this.codes.delete(
      normalizedEmail,
    );

    this.verifiedEmails.add(
      normalizedEmail,
    );

    return true;
  }

  isVerified(email: string) {
    return this.verifiedEmails.has(
      email.toLowerCase().trim(),
    );
  }
}