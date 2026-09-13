import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

type ResetData = {
    code: string;
    expiresAt: number;
};

@Injectable()
export class PasswordResetService {
    private readonly resetCodes = new Map<
        string,
        ResetData
    >();

    generateCode() {
        return Math.floor(
            100000 +
                Math.random() * 900000,
        ).toString();
    }

    saveCode(
        email: string,
        code: string,
    ) {
        const normalizedEmail =
            email.toLowerCase().trim();

        this.resetCodes.set(
            normalizedEmail,
            {
                code,
                expiresAt:
                    Date.now() +
                    10 * 60 * 1000,
            },
        );
    }

    verifyCode(
        email: string,
        code: string,
    ) {
        const normalizedEmail =
            email.toLowerCase().trim();

        const resetData =
            this.resetCodes.get(
                normalizedEmail,
            );

        if (!resetData) {
            throw new BadRequestException(
                'Reset code not found or expired',
            );
        }

        if (
            Date.now() >
            resetData.expiresAt
        ) {
            this.resetCodes.delete(
                normalizedEmail,
            );

            throw new BadRequestException(
                'Reset code has expired',
            );
        }

        if (resetData.code !== code) {
            throw new BadRequestException(
                'Invalid reset code',
            );
        }

        this.resetCodes.delete(
            normalizedEmail,
        );

        return true;
    }
}