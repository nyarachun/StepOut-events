import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from '../events/entities/event.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
import { Registration } from './entities/registration.entity.js';

@Injectable()
export class RegistrationsService {
    constructor(
        @InjectRepository(Registration)
        private readonly registrationRepository: Repository<Registration>,

        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(
        userId: number,
        createRegistrationDto: CreateRegistrationDto,
    ) {
        const user =
            await this.userRepository.findOneBy({
                id: userId,
            });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        const event =
            await this.eventRepository.findOne({
                where: {
                    id: createRegistrationDto.eventId,
                },
                relations: {
                    organizer: true,
                },
            });

        if (!event) {
            throw new NotFoundException(
                'Event not found',
            );
        }

        if (
            event.organizer.id ===
            userId
        ) {
            throw new ForbiddenException(
                'Organizer cannot register for their own event',
            );
        }

        const existingRegistration =
            await this.registrationRepository.findOne(
                {
                    where: {
                        user: {
                            id: userId,
                        },
                        event: {
                            id: event.id,
                        },
                    },
                },
            );

        if (existingRegistration) {
            throw new ConflictException(
                'You are already registered for this event',
            );
        }

        const registeredCount =
            await this.registrationRepository.count(
                {
                    where: {
                        event: {
                            id: event.id,
                        },
                    },
                },
            );

        if (
            registeredCount >=
            event.capacity
        ) {
            throw new ConflictException(
                'This event is full',
            );
        }

        const registration =
            this.registrationRepository.create(
                {
                    user,
                    event,
                },
            );

        return this.registrationRepository.save(
            registration,
        );
    }

    async findMyRegistrations(
        userId: number,
    ) {
        return this.registrationRepository.find(
            {
                where: {
                    user: {
                        id: userId,
                    },
                },
                relations: {
                    event: true,
                },
                order: {
                    createdAt: 'DESC',
                },
            },
        );
    }

    async findMyRegistrationForEvent(
        userId: number,
        eventId: number,
    ) {
        const registration =
            await this.registrationRepository.findOne(
                {
                    where: {
                        user: {
                            id: userId,
                        },
                        event: {
                            id: eventId,
                        },
                    },
                    relations: {
                        event: true,
                    },
                },
            );

        if (!registration) {
            throw new NotFoundException(
                'Registration not found',
            );
        }

        return registration;
    }

    async remove(
        userId: number,
        registrationId: number,
    ) {
        const registration =
            await this.registrationRepository.findOne(
                {
                    where: {
                        id: registrationId,
                    },
                    relations: {
                        user: true,
                    },
                },
            );

        if (!registration) {
            throw new NotFoundException(
                'Registration not found',
            );
        }

        if (
            registration.user.id !==
            userId
        ) {
            throw new ForbiddenException(
                'You can only cancel your own registration',
            );
        }

        await this.registrationRepository.remove(
            registration,
        );

        return {
            message:
                'Registration cancelled successfully',
        };
    }
}