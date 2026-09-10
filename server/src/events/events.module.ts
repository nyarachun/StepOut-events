import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';
import { Event } from './entities/event.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { City } from '../cities/entities/city.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, Category, City])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
