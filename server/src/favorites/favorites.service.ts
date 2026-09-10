import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Favorite } from './entities/favorite.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(userId: number, createFavoriteDto: CreateFavoriteDto) {
    const { eventId }: CreateFavoriteDto = createFavoriteDto;

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

    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        user: { id: userId },
        event: { id: eventId },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Event is already in favorites');
    }

    const favorite = this.favoriteRepository.create({
      user,
      event,
    });

    return this.favoriteRepository.save(favorite);
  }

  async findUserFavorites(userId: number) {
    return this.favoriteRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        event: true,
      },
    });
  }

  async remove(userId: number, eventId: number) {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        user: { id: userId },
        event: { id: eventId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoriteRepository.remove(favorite);
  }
}
