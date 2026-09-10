import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum RegistrationRole {
  USER = 'user',
  ORGANIZER = 'organizer',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(RegistrationRole)
  role: RegistrationRole;
}
