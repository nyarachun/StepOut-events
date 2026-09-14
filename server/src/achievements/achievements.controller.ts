import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AchievementsService } from './achievements.service.js';
import { CurrentUser } from '../auth/decorator/current-user.decorator.js';

type CurrentUserData = {
  id: number;
};

@Controller('achievements')
export class AchievementsController {
  constructor(
    private readonly achievementsService: AchievementsService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMyAchievements(
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.achievementsService.getUserAchievements(
      user.id,
    );
  }
}