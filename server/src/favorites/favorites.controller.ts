import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { FavoritesService } from './favorites.service.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorator/current-user.decorator.js';

type CurrentUserData = {
  id: number;
};

@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.favoritesService.create(user.id, createFavoriteDto);
  }

  @Get('me')
  findMyFavorites(@CurrentUser() user: CurrentUserData) {
    return this.favoritesService.findUserFavorites(user.id);
  }

  @Delete(':eventId')
  remove(
    @CurrentUser() user: CurrentUserData,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    return this.favoritesService.remove(user.id, eventId);
  }
}
