import {
    IsString,
    Length,
    MinLength,
} from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @Length(6, 6)
    code: string;

    @IsString()
    @MinLength(8)
    newPassword: string;

    @IsString()
    @MinLength(8)
    confirmPassword: string;
}