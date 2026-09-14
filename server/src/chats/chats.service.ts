import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';

import { EventsService } from '../events/events.service.js';
import { User } from '../users/entities/user.entity.js';

import { ChatGateway } from './chat.gateway.js';
import { CreateEventChatDto } from './dto/create-event-chat.dto.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { ChatParticipant } from './entities/chat-participant.entity.js';
import {
    Chat,
    ChatType,
} from './entities/chat.entity.js';
import { Message } from './entities/message.entity.js';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,

        @InjectRepository(ChatParticipant)
        private readonly chatParticipantRepository: Repository<ChatParticipant>,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly eventsService: EventsService,
        private readonly chatGateway: ChatGateway,
    ) {}

    async createEventChat(
        userId: number,
        dto: CreateEventChatDto,
    ) {
        const event =
            await this.eventsService.findOne(
                dto.eventId,
            );

        const organizerId =
            event.organizer.id;

        if (organizerId === userId) {
            throw new ForbiddenException(
                'You cannot ask yourself a question',
            );
        }

        const existingChats =
            await this.chatRepository.find({
                where: {
                    type: ChatType.EVENT,
                    event: {
                        id: event.id,
                    },
                },
                relations: {
                    participants: {
                        user: true,
                    },
                },
            });

        let chat = existingChats.find(
            (currentChat) =>
                currentChat.participants.some(
                    (participant) =>
                        participant.user.id ===
                        userId,
                ) &&
                currentChat.participants.some(
                    (participant) =>
                        participant.user.id ===
                        organizerId,
                ),
        );

        if (!chat) {
            chat =
                this.chatRepository.create({
                    type: ChatType.EVENT,
                    event,
                    squad: null,
                });

            chat =
                await this.chatRepository.save(
                    chat,
                );

            const participants =
                this.chatParticipantRepository.create(
                    [
                        {
                            chat,
                            user: {
                                id: userId,
                            } as User,
                            lastReadAt: null,
                        },
                        {
                            chat,
                            user: {
                                id: organizerId,
                            } as User,
                            lastReadAt: null,
                        },
                    ],
                );

            await this.chatParticipantRepository.save(
                participants,
            );
        }

        const sender =
            await this.userRepository.findOneBy({
                id: userId,
            });

        if (!sender) {
            throw new NotFoundException(
                'User not found',
            );
        }

        const message =
            this.messageRepository.create(
                {
                    chat,
                    sender,
                    text: dto.message,
                    isSystem: false,
                },
            );

        await this.messageRepository.save(
            message,
        );

        return this.chatRepository.findOne({
            where: {
                id: chat.id,
            },
            relations: {
                event: true,
                squad: true,
                participants: {
                    user: true,
                },
            },
        });
    }

    async getUserChats(
        userId: number,
    ) {
        const participants =
            await this.chatParticipantRepository.find(
                {
                    where: {
                        user: {
                            id: userId,
                        },
                    },
                    relations: {
                        chat: {
                            event: {
                                organizer: true,
                                category: true,
                                city: true,
                            },
                            squad: true,
                            participants: {
                                user: true,
                            },
                        },
                    },
                    order: {
                        id: 'DESC',
                    },
                },
            );

        return participants.map(
            (participant) =>
                participant.chat,
        );
    }

    async getMessages(
        userId: number,
        chatId: number,
    ) {
        await this.checkParticipant(
            userId,
            chatId,
        );

        return this.messageRepository.find(
            {
                where: {
                    chat: {
                        id: chatId,
                    },
                },
                relations: {
                    sender: true,
                },
                order: {
                    createdAt: 'ASC',
                },
            },
        );
    }

    async sendMessage(
        userId: number,
        chatId: number,
        dto: SendMessageDto,
    ) {
        await this.checkParticipant(
            userId,
            chatId,
        );

        const sender =
            await this.userRepository.findOneBy({
                id: userId,
            });

        if (!sender) {
            throw new NotFoundException(
                'User not found',
            );
        }

        const chat =
            await this.chatRepository.findOneBy(
                {
                    id: chatId,
                },
            );

        if (!chat) {
            throw new NotFoundException(
                'Chat not found',
            );
        }

        if (chat.type === ChatType.ADMIN) {
            throw new ForbiddenException(
                'You cannot send messages to this chat',
            );
        }

        const message =
            this.messageRepository.create(
                {
                    chat,
                    sender,
                    text: dto.text,
                    isSystem: false,
                },
            );

        const savedMessage = await this.messageRepository.save(message);

        const participants = await this.chatParticipantRepository.find({
            where: { chat: { id: chatId } },
            relations: { user: true },
        });

        this.chatGateway.notifyChatMessage(chatId, {
            ...savedMessage,
            sender: sender,
        });

        for (const participant of participants) {
            if (participant.user.id !== userId) {
                const unreadCount = await this.getTotalUnreadCount(
                    participant.user.id,
                );

                this.chatGateway.notifyUnreadCount(
                    participant.user.id,
                    unreadCount,
                );
            }
        }

        return savedMessage;
    }

    async getUnreadCount(userId: number, chatId?: number) {
        const participant = await this.chatParticipantRepository.findOne({
            where: {
                user: { id: userId },
                chat: chatId ? { id: chatId } : undefined,
            },
            relations: { chat: true },
        });

        if (!participant) {
            return 0;
        }

        const baseDate = participant.lastReadAt ?? new Date(0);

        const where: Record<string, unknown> = {
            chat: { id: participant.chat.id },
            createdAt: MoreThan(baseDate),
            sender: { id: Not(userId) },
        };

        return this.messageRepository.count({
            where,
        });
    }

    async getTotalUnreadCount(userId: number) {
        const participants = await this.chatParticipantRepository.find({
            where: {
                user: { id: userId },
            },
            relations: { chat: true },
        });

        let total = 0;

        for (const participant of participants) {
            const unreadCount = await this.getUnreadCount(
                userId,
                participant.chat.id,
            );
            total += unreadCount;
        }

        return total;
    }

    async markChatAsRead(userId: number, chatId: number) {
        const participant = await this.chatParticipantRepository.findOne({
            where: {
                user: { id: userId },
                chat: { id: chatId },
            },
        });

        if (!participant) {
            throw new ForbiddenException('You are not a participant of this chat');
        }

        participant.lastReadAt = new Date();
        await this.chatParticipantRepository.save(participant);

        const unreadCount = await this.getTotalUnreadCount(userId);
        this.chatGateway.notifyUnreadCount(userId, unreadCount);

        return { unreadCount };
    }

    private async checkParticipant(
        userId: number,
        chatId: number,
    ) {
        const participant =
            await this.chatParticipantRepository.findOne(
                {
                    where: {
                        user: {
                            id: userId,
                        },
                        chat: {
                            id: chatId,
                        },
                    },
                },
            );

        if (!participant) {
            throw new ForbiddenException(
                'You are not a participant of this chat',
            );
        }

        return participant;
    }
}