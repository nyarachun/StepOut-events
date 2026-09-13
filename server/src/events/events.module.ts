import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { City } from '../cities/entities/city.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { Registration } from '../registrations/entities/registration.entity.js';
import { User } from '../users/entities/user.entity.js';

import { Event } from './entities/event.entity.js';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Event,
            User,
            City,
            Category,
            Registration,
        ]),
    ],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule {}