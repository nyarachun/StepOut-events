import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from '../events/entities/event.entity.js';
import { Favorite } from '../favorites/entities/favorite.entity.js';
import { Registration } from '../registrations/entities/registration.entity.js';

type Achievement = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
};

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,

    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async getUserAchievements(
    userId: number,
  ) {
    const registrations =
      await this.registrationRepository.count({
        where: {
          user: {
            id: userId,
          },
        },
      });

    const favorites =
      await this.favoriteRepository.count({
        where: {
          user: {
            id: userId,
          },
        },
      });

    const createdEvents =
      await this.eventRepository.count({
        where: {
          organizer: {
            id: userId,
          },
        },
      });

    const achievements: Achievement[] = [
      {
        id: 'first-step',
        title: 'First Step',
        description:
          'Register for your first event',
        earned: registrations >= 1,
      },
      {
        id: 'explorer',
        title: 'Explorer',
        description:
          'Register for 5 events',
        earned: registrations >= 5,
      },
      {
        id: 'regular',
        title: 'Regular',
        description:
          'Register for 10 events',
        earned: registrations >= 10,
      },
      {
        id: 'favorite-hunter',
        title: 'Favorite Hunter',
        description:
          'Add 5 events to favorites',
        earned: favorites >= 5,
      },
      {
        id: 'organizer',
        title: 'Organizer',
        description:
          'Publish your first event',
        earned: createdEvents >= 1,
      },
      {
        id: 'event-maker',
        title: 'Event Maker',
        description:
          'Publish 5 events',
        earned: createdEvents >= 5,
      },
    ];

    return {
      earned: achievements.filter(
        (achievement) =>
          achievement.earned,
      ),
      all: achievements,
    };
  }
}