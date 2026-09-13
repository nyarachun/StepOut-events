import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { PasswordResetService } from './password-reset.service.js';
import {
  RegisterDto,
  RegistrationRole,
} from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { EmailVerificationService } from './email-verification.service.js';
import { MailService } from './mail.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { UserRole } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly mailService: MailService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ) {
    const userData: CreateUserDto = {
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
      role:
        registerDto.role ===
        RegistrationRole.ORGANIZER
          ? UserRole.ORGANIZER
          : UserRole.USER,
    };

    const user =
      await this.usersService.create(
        userData,
      );

    const code =
      this.emailVerificationService.generateCode();

    this.emailVerificationService.saveCode(
      user.email,
      code,
    );

    await this.mailService.sendVerificationCode(
      user.email,
      code,
    );

    return {
      message:
        'Registration successful. Check your email for the verification code.',
      email: user.email,
    };
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ) {
    this.emailVerificationService.verifyCode(
      verifyEmailDto.email,
      verifyEmailDto.code,
    );

    return {
      message:
        'Email verified successfully',
    };
  }

  async resendVerificationCode(
    email: string,
  ) {
    const user =
      await this.usersService.findByEmail(
        email,
      );

    if (!user) {
      throw new NotFoundException(
        'User with this email was not found',
      );
    }

    if (
      this.emailVerificationService.isVerified(
        user.email,
      )
    ) {
      throw new ConflictException(
        'Email is already verified',
      );
    }

    const code =
      this.emailVerificationService.generateCode();

    this.emailVerificationService.saveCode(
      user.email,
      code,
    );

    await this.mailService.sendVerificationCode(
      user.email,
      code,
    );

    return {
      message:
        'A new verification code has been sent',
    };
  }

  async login(loginDto: LoginDto) {
    const user =
      await this.usersService.findByEmail(
        loginDto.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isEmailVerified =
      this.emailVerificationService.isVerified(
        user.email,
      );

    if (!isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        loginDto.password,
        user.password,
      );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token:
        await this.jwtService.signAsync(
          payload,
        ),
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
) {
    const user =
        await this.usersService.findByEmail(
            forgotPasswordDto.email,
        );

    if (!user) {
        throw new NotFoundException(
            'User with this email was not found',
        );
    }

    const code =
        this.passwordResetService.generateCode();

    this.passwordResetService.saveCode(
        user.email,
        code,
    );

    await this.mailService.sendVerificationCode(
        user.email,
        code,
    );

    return {
        message:
            'Password reset code has been sent to your email',
        email: user.email,
    };
}

async resetPassword(
    email: string,
    resetPasswordDto: ResetPasswordDto,
) {
    if (
        resetPasswordDto.newPassword !==
        resetPasswordDto.confirmPassword
    ) {
        throw new ConflictException(
            'Passwords do not match',
        );
    }

    this.passwordResetService.verifyCode(
        email,
        resetPasswordDto.code,
    );

    const user =
        await this.usersService.findByEmail(
            email,
        );

    if (!user) {
        throw new NotFoundException(
            'User with this email was not found',
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            resetPasswordDto.newPassword,
            10,
        );

    await this.usersService.updatePassword(
        user.id,
        hashedPassword,
    );

    return {
        message:
            'Password has been reset successfully',
    };
}
}