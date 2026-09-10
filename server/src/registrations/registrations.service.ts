import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Registration } from './entities/registration.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(userId: number, createRegistrationDto: CreateRegistrationDto) {
    const { eventId }: CreateRegistrationDto = createRegistrationDto;

    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const event = await this.eventRepository.findOneBy({
      id: eventId,
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    const existingRegistration = await this.registrationRepository.findOne({
      where: {
        user: { id: userId },
        event: { id: eventId },
      },
    });

    if (existingRegistration) {
      throw new ConflictException('You are already registered for this event');
    }

    const registration = this.registrationRepository.create({
      user,
      event,
    });

    return this.registrationRepository.save(registration);
  }

  async findUserRegistrations(userId: number) {
    return this.registrationRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        event: true,
      },
    });
  }

  async remove(userId: number, eventId: number) {
    const registration = await this.registrationRepository.findOne({
      where: {
        user: { id: userId },
        event: { id: eventId },
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    await this.registrationRepository.remove(registration);
  }
}
