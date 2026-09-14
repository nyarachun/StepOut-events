import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from '../events/entities/event.entity.js';
import { User } from '../users/entities/user.entity.js';
import { RegistrationsController } from './registrations.controller.js';
import { Registration } from './entities/registration.entity.js';
import { RegistrationsService } from './registrations.service.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Registration,
            Event,
            User,
        ]),
    ],
    controllers: [
        RegistrationsController,
    ],
    providers: [
        RegistrationsService,
    ],
    exports: [
        RegistrationsService,
    ],
})
export class RegistrationsModule {}