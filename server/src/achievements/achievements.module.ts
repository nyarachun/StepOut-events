import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from '../events/entities/event.entity.js';
import { Favorite } from '../favorites/entities/favorite.entity.js';
import { Registration } from '../registrations/entities/registration.entity.js';
import { Achievement } from './entities/achievement.entity.js';
import { AchievementsController } from './achievements.controller.js';
import { AchievementsService } from './achievements.service.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Achievement,
            Event,
            Favorite,
            Registration,
        ]),
    ],
    controllers: [
        AchievementsController,
    ],
    providers: [
        AchievementsService,
    ],
    exports: [
        AchievementsService,
    ],
})
export class AchievementsModule {}