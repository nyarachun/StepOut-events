import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatParticipant } from '../chats/entities/chat-participant.entity.js';
import { Chat } from '../chats/entities/chat.entity.js';
import { Message } from '../chats/entities/message.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { User } from '../users/entities/user.entity.js';

import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Event,
            User,
            Chat,
            ChatParticipant,
            Message,
        ]),
    ],
    controllers: [
        AdminController,
    ],
    providers: [
        AdminService,
    ],
})
export class AdminModule {}