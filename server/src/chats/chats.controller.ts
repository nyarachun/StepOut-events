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
import { ChatsService } from './chats.service.js';
import { CreateEventChatDto } from './dto/create-event-chat.dto.js';
import { SendMessageDto } from './dto/send-message.dto.js';

type CurrentUserData = {
  id: number;
};

@Controller('chats')
@UseGuards(AuthGuard('jwt'))
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  getUserChats(@CurrentUser() user: CurrentUserData) {
    return this.chatsService.getUserChats(user.id);
  }

  @Get('unread')
  getUnreadCount(@CurrentUser() user: CurrentUserData) {
    return this.chatsService.getTotalUnreadCount(user.id);
  }

  @Post('events')
  createEventChat(
    @CurrentUser() user: CurrentUserData,
    @Body() createEventChatDto: CreateEventChatDto,
  ) {
    return this.chatsService.createEventChat(user.id, createEventChatDto);
  }

  @Get(':chatId/messages')
  getMessages(
    @CurrentUser() user: CurrentUserData,
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    return this.chatsService.getMessages(user.id, chatId);
  }

  @Post(':chatId/read')
  markChatAsRead(
    @CurrentUser() user: CurrentUserData,
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    return this.chatsService.markChatAsRead(user.id, chatId);
  }

  @Post(':chatId/messages')
  sendMessage(
    @CurrentUser() user: CurrentUserData,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatsService.sendMessage(user.id, chatId, sendMessageDto);
  }
}
