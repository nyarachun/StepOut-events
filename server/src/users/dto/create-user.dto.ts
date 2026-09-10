import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

import { UserRole } from '../entities/user.entity.js';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;
}
