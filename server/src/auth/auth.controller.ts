import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';

class ResendVerificationDto {
    email: string;
}

class ResetPasswordRequestDto {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    register(
        @Body() registerDto: RegisterDto,
    ) {
        return this.authService.register(
            registerDto,
        );
    }

    @Post('verify-email')
    verifyEmail(
        @Body()
        verifyEmailDto: VerifyEmailDto,
    ) {
        return this.authService.verifyEmail(
            verifyEmailDto,
        );
    }

    @Post('resend-verification')
    resendVerification(
        @Body()
        resendVerificationDto: ResendVerificationDto,
    ) {
        return this.authService.resendVerificationCode(
            resendVerificationDto.email,
        );
    }

    @Post('forgot-password')
    forgotPassword(
        @Body()
        forgotPasswordDto: ForgotPasswordDto,
    ) {
        return this.authService.forgotPassword(
            forgotPasswordDto,
        );
    }

    @Post('reset-password')
    resetPassword(
        @Body()
        resetPasswordDto: ResetPasswordRequestDto,
    ) {
        const {
            email,
            ...passwordData
        } = resetPasswordDto;

        const dto: ResetPasswordDto =
            passwordData;

        return this.authService.resetPassword(
            email,
            dto,
        );
    }

    @Post('login')
    login(
        @Body() loginDto: LoginDto,
    ) {
        return this.authService.login(
            loginDto,
        );
    }
}