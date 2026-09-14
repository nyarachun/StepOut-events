import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { ChatParticipant } from '../chats/entities/chat-participant.entity.js';
import {
    Chat,
    ChatType,
} from '../chats/entities/chat.entity.js';
import { Message } from '../chats/entities/message.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { User, UserRole } from '../users/entities/user.entity.js';

import { BanEventDto } from './dto/ban-event.dto.js';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,

        @InjectRepository(ChatParticipant)
        private readonly chatParticipantRepository: Repository<ChatParticipant>,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async findAllEvents(
        userRole: UserRole,
    ) {
        this.checkAdmin(userRole);

        return this.eventRepository.find({
            relations: {
                organizer: true,
                category: true,
                city: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async banEvent(
        eventId: number,
        userRole: UserRole,
        banEventDto: BanEventDto,
    ) {
        this.checkAdmin(userRole);

        const event =
            await this.eventRepository.findOne({
                where: {
                    id: eventId,
                },
                relations: {
                    organizer: true,
                },
            });

        if (!event) {
            throw new NotFoundException(
                'Event not found',
            );
        }

        const organizer =
            await this.userRepository.findOneBy({
                id: event.organizer.id,
            });

        if (!organizer) {
            throw new NotFoundException(
                'Event organizer not found',
            );
        }

        const existingAdminChat =
            await this.chatRepository.findOne({
                where: {
                    type: ChatType.ADMIN,
                    event: IsNull(),
                    participants: {
                        user: {
                            id: organizer.id,
                        },
                    },
                },
                relations: {
                    participants: {
                        user: true,
                    },
                },
            });

        let chat =
            existingAdminChat;

        if (!chat) {
            chat =
                this.chatRepository.create({
                    type: ChatType.ADMIN,
                    event: null,
                    squad: null,
                });

            chat =
                await this.chatRepository.save(
                    chat,
                );

            const participant =
                this.chatParticipantRepository.create(
                    {
                        chat,
                        user: organizer,
                        lastReadAt: null,
                    },
                );

            await this.chatParticipantRepository.save(
                participant,
            );
        }

        const message =
            this.messageRepository.create({
                chat,
                sender: null,
                isSystem: true,
                text: `Your event "${event.title}" was removed by an administrator.\n\nReason: ${banEventDto.reason}`,
            });

        await this.messageRepository.save(
            message,
        );

        await this.eventRepository.remove(
            event,
        );

        return {
            message:
                'Event banned and removed successfully',
        };
    }

    private checkAdmin(
        userRole: UserRole,
    ) {
        if (
            userRole !==
            UserRole.ADMIN
        ) {
            throw new ForbiddenException(
                'Admin access required',
            );
        }
    }
}