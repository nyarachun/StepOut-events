import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavoritesController } from './favorites.controller.js';
import { FavoritesService } from './favorites.service.js';
import { Favorite } from './entities/favorite.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Event } from '../events/entities/event.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Event])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
