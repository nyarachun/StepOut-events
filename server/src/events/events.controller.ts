import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../auth/decorator/current-user.decorator.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '../users/entities/user.entity.js';

import { CreateEventDto } from './dto/create-event.dto.js';
import { GetEventsDto } from './dto/get-events.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { EventsService } from './events.service.js';

type CurrentUserData = {
  id: number;
  email: string;
  role: UserRole;
};

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(@Query() getEventsDto: GetEventsDto) {
    return this.eventsService.findAll(getEventsDto);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  findMyEvents(
    @CurrentUser() user: { id: number; role: string },
  ) {
    return this.eventsService.findMyEvents(user.id, user.role);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @CurrentUser() user: { id: number; role: string },
    @Body() createEventDto: CreateEventDto,
  ) {
    return this.eventsService.create(user.id, user.role, createEventDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateForOrganizer(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; role: string },
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.updateForOrganizer(
      id,
      user.id,
      user.role,
      updateEventDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  removeForOrganizer(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; role: string },
  ) {
    return this.eventsService.removeForOrganizer(id, user.id, user.role);
  }

  @Patch(':id/admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, user.id, user.role, updateEventDto);
  }

  @Delete(':id/admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.eventsService.remove(id, user.id, user.role);
  }
}
