import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from '../events/entities/event.entity.js';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';
import { Category } from './entities/category.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Event])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
