import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../auth/decorator/current-user.decorator.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '../users/entities/user.entity.js';

import { AdminService } from './admin.service.js';
import { BanEventDto } from './dto/ban-event.dto.js';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('events')
  findAllEvents(@CurrentUser() user: { role: UserRole }) {
    return this.adminService.findAllEvents(user.role);
  }

  @Post('events/:eventId/ban')
  banEvent(
    @CurrentUser() user: { role: UserRole },
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() banEventDto: BanEventDto,
  ) {
    return this.adminService.banEvent(eventId, user.role, banEventDto);
  }
}
