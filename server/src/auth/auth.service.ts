import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  RegisterDto,
  RegistrationRole,
} from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { UserRole } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

    return {
      message: 'Registration successful.',
      email: user.email,
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

}