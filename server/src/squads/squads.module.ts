import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '../categories/entities/category.entity.js';
import { City } from '../cities/entities/city.entity.js';
import { User } from '../users/entities/user.entity.js';

import { ChatParticipant } from '../chats/entities/chat-participant.entity.js';
import { Chat } from '../chats/entities/chat.entity.js';
import { Message } from '../chats/entities/message.entity.js';

import { SquadsService } from './squads.service.js';
import { SquadsController } from './squads.controller.js';
import { Squad } from './entities/squad.entity.js';
import { SquadMember } from './entities/squad-member.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Squad,
            SquadMember,
            User,
            City,
            Category,
            Chat,
            ChatParticipant,
            Message,
        ]),
    ],
    controllers: [
        SquadsController,
    ],
    providers: [
        SquadsService,
    ],
    exports: [
        SquadsService,
    ],
})
export class SquadsModule {}