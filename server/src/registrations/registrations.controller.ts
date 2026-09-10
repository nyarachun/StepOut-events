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

import { RegistrationsService } from './registrations.service.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorator/current-user.decorator.js';

type CurrentUserData = {
  id: number;
};

@Controller('registrations')
@UseGuards(AuthGuard('jwt'))
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() createRegistrationDto: CreateRegistrationDto,
  ) {
    return this.registrationsService.create(user.id, createRegistrationDto);
  }

  @Get('me')
  findMyRegistrations(@CurrentUser() user: CurrentUserData) {
    return this.registrationsService.findUserRegistrations(user.id);
  }

  @Delete(':eventId')
  remove(
    @CurrentUser() user: CurrentUserData,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    return this.registrationsService.remove(user.id, eventId);
  }
}
