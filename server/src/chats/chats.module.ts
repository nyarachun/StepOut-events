import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsModule } from '../events/events.module.js';
import { User } from '../users/entities/user.entity.js';

import { ChatGateway } from './chat.gateway.js';
import { ChatsController } from './chats.controller.js';
import { ChatsService } from './chats.service.js';
import { ChatParticipant } from './entities/chat-participant.entity.js';
import { Chat } from './entities/chat.entity.js';
import { Message } from './entities/message.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Chat,
            ChatParticipant,
            Message,
            User,
        ]),
        EventsModule,
    ],
    controllers: [
        ChatsController,
    ],
    providers: [
        ChatsService,
        ChatGateway,
    ],
    exports: [ChatGateway],
})
export class ChatsModule {}