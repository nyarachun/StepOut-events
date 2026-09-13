import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { User, UserRole } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new NotFoundException(
        `User with id ${id} not found`,
      );
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const {
      email,
      password,
      name,
      role,
    }: CreateUserDto = createUserDto;

    const existingUser =
      await this.userRepository.findOneBy({
        email,
      });

    if (existingUser) {
      throw new ConflictException(
        'User with this email already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        this.SALT_ROUNDS,
      );

    const user =
      this.userRepository.create({
        email,
        password: hashedPassword,
        name,
        role,
      });

    const savedUser =
      await this.userRepository.save(user);

    const {
      password: _password,
      ...userWithoutPassword
    } = savedUser;

    return userWithoutPassword;
  }

  async findAll() {
    const users =
      await this.userRepository.find();

    return users.map(
      ({
        password: _password,
        ...user
      }) => user,
    );
  }

  async findOne(id: number) {
    const user =
      await this.userRepository.findOne({
        where: { id },
      });

    if (!user) {
      throw new NotFoundException(
        `User with id ${id} not found`,
      );
    }

    return user;
  }

  async findOneForUser(
    id: number,
    currentUserId: number,
    currentUserRole: UserRole,
  ) {
    if (
      currentUserRole !== UserRole.ADMIN &&
      id !== currentUserId
    ) {
      throw new ForbiddenException(
        'You can only view your own profile',
      );
    }

    return this.findOne(id);
  }

  async findByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where(
        'user.email = :email',
        { email },
      )
      .getOne();
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ) {
    const user =
      await this.findUserById(id);

    const {
      email,
      name,
      bio,
      interests,
    }: UpdateUserDto = updateUserDto;

    if (
      email !== undefined &&
      email !== user.email
    ) {
      const existingUser =
        await this.userRepository.findOneBy({
          email,
        });

      if (
        existingUser &&
        existingUser.id !== id
      ) {
        throw new ConflictException(
          'User with this email already exists',
        );
      }

      user.email = email;
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (interests !== undefined) {
      user.interests = interests;
    }

    const updatedUser =
      await this.userRepository.save(user);

    const {
      password: _password,
      ...userWithoutPassword
    } = updatedUser;

    return userWithoutPassword;
  }

  async updateForUser(
    id: number,
    currentUserId: number,
    currentUserRole: UserRole,
    updateUserDto: UpdateUserDto,
  ) {
    if (
      id !== currentUserId &&
      currentUserRole !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'You can only edit your own profile',
      );
    }

    return this.update(
      id,
      updateUserDto,
    );
  }

  async changePassword(
    id: number,
    currentUserId: number,
    currentUserRole: UserRole,
    changePasswordDto: ChangePasswordDto,
  ) {
    if (
      id !== currentUserId &&
      currentUserRole !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'You can only change your own password',
      );
    }

    const user =
      await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.id = :id', { id })
        .getOne();

    if (!user) {
      throw new NotFoundException(
        `User with id ${id} not found`,
      );
    }

    const isCurrentPasswordCorrect =
      await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

    if (!isCurrentPasswordCorrect) {
      throw new UnauthorizedException(
        'Current password is incorrect',
      );
    }

    if (
      changePasswordDto.newPassword !==
      changePasswordDto.confirmPassword
    ) {
      throw new ConflictException(
        'New passwords do not match',
      );
    }

    user.password =
      await bcrypt.hash(
        changePasswordDto.newPassword,
        this.SALT_ROUNDS,
      );

    await this.userRepository.save(
      user,
    );

    return {
      message:
        'Password changed successfully',
    };
  }

  async updatePassword(
    id: number,
    hashedPassword: string,
) {
    const user =
        await this.findUserById(id);

    user.password = hashedPassword;

    await this.userRepository.save(user);

    return {
        message:
            'Password updated successfully',
    };
}

  async remove(id: number) {
    const user =
      await this.findUserById(id);

    await this.userRepository.remove(user);
  }
}