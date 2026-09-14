import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../categories/entities/category.entity.js';
import { City } from '../cities/entities/city.entity.js';
import { ChatParticipant } from '../chats/entities/chat-participant.entity.js';
import {
    Chat,
    ChatType,
} from '../chats/entities/chat.entity.js';
import { Message } from '../chats/entities/message.entity.js';
import { User } from '../users/entities/user.entity.js';

import { CreateSquadDto } from './dto/create-squad.dto.js';
import {
    Squad,
    SquadStatus,
} from './entities/squad.entity.js';
import { SquadMember } from './entities/squad-member.entity.js';

@Injectable()
export class SquadsService {
    constructor(
        @InjectRepository(Squad)
        private readonly squadRepository: Repository<Squad>,

        @InjectRepository(SquadMember)
        private readonly squadMemberRepository: Repository<SquadMember>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,

        @InjectRepository(ChatParticipant)
        private readonly chatParticipantRepository: Repository<ChatParticipant>,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async createOrJoin(
        userId: number,
        dto: CreateSquadDto,
    ) {
        const user =
            await this.userRepository.findOneBy({
                id: userId,
            });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        const city =
            await this.cityRepository.findOneBy({
                id: dto.cityId,
            });

        if (!city) {
            throw new NotFoundException(
                'City not found',
            );
        }

        const category =
            await this.categoryRepository.findOneBy({
                id: dto.categoryId,
            });

        if (!category) {
            throw new NotFoundException(
                'Category not found',
            );
        }

        if (
            dto.groupSizeMin >
            dto.groupSizeMax
        ) {
            throw new BadRequestException(
                'Minimum group size cannot be greater than maximum group size',
            );
        }

        const existingMember =
            await this.squadMemberRepository.findOne(
                {
                    where: {
                        user: {
                            id: userId,
                        },
                        squad: {
                            status:
                                SquadStatus.OPEN,
                        },
                    },
                    relations: {
                        squad: true,
                    },
                },
            );

        if (existingMember) {
            throw new BadRequestException(
                'You already have an open squad',
            );
        }

        const openSquads =
            await this.squadRepository.find({
                where: {
                    cityId: dto.cityId,
                    categoryId:
                        dto.categoryId,
                    status:
                        SquadStatus.OPEN,
                },
                relations: {
                    members: {
                        user: true,
                    },
                },
            });

        const suitableSquad =
            openSquads.find(
                (squad) => {
                    const memberCount =
                        squad.members.length;

                    if (
                        memberCount >=
                        squad.groupSizeMax
                    ) {
                        return false;
                    }

                    if (
                        squad.groupSizeMin !==
                        dto.groupSizeMin ||
                        squad.groupSizeMax !==
                        dto.groupSizeMax
                    ) {
                        return false;
                    }

                    return this.hasInterestOverlap(
                        squad.interests,
                        dto.interests,
                    );
                },
            );

        const squad =
            suitableSquad ||
            this.squadRepository.create({
                cityId: dto.cityId,
                categoryId:
                    dto.categoryId,
                groupSizeMin:
                    dto.groupSizeMin,
                groupSizeMax:
                    dto.groupSizeMax,
                interests:
                    dto.interests,
                status:
                    SquadStatus.OPEN,
            });

        if (!suitableSquad) {
            await this.squadRepository.save(
                squad,
            );
        }

        const member =
            this.squadMemberRepository.create(
                {
                    squad,
                    user,
                },
            );

        await this.squadMemberRepository.save(
            member,
        );

        const membersCount =
            suitableSquad
                ? suitableSquad.members
                      .length + 1
                : 1;

        if (
            membersCount >=
            squad.groupSizeMin
        ) {
            squad.status =
                SquadStatus.FORMED;

            await this.squadRepository.save(
                squad,
            );

            await this.createSquadChat(
                squad.id,
            );
        }

        return this.squadRepository.findOne({
            where: {
                id: squad.id,
            },
            relations: {
                members: {
                    user: true,
                },
            },
        });
    }

    async findMySquads(
        userId: number,
    ) {
        return this.squadRepository.find({
            where: {
                members: {
                    user: {
                        id: userId,
                    },
                },
            },
            relations: {
                members: {
                    user: true,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    private async createSquadChat(
        squadId: number,
    ) {
        const squad =
            await this.squadRepository.findOne({
                where: {
                    id: squadId,
                },
                relations: {
                    members: {
                        user: true,
                    },
                },
            });

        if (!squad) {
            throw new NotFoundException(
                'Squad not found',
            );
        }

        const existingChat =
            await this.chatRepository.findOne(
                {
                    where: {
                        type: ChatType.SQUAD,
                        squad: {
                            id: squad.id,
                        },
                    },
                },
            );

        if (existingChat) {
            return existingChat;
        }

        const chat =
            this.chatRepository.create({
                type: ChatType.SQUAD,
                event: null,
                squad,
            });

        const savedChat =
            await this.chatRepository.save(
                chat,
            );

        const participants =
            squad.members.map(
                (member) =>
                    this.chatParticipantRepository.create(
                        {
                            chat: savedChat,
                            user: member.user,
                            lastReadAt: null,
                        },
                    ),
            );

        await this.chatParticipantRepository.save(
            participants,
        );

        const systemMessage =
            this.messageRepository.create(
                {
                    chat: savedChat,
                    sender: null,
                    text:
                        'Your squad has been formed. You can now get to know each other and plan your event together.',
                    isSystem: true,
                },
            );

        await this.messageRepository.save(
            systemMessage,
        );

        return savedChat;
    }

    private hasInterestOverlap(
        first: string[],
        second: string[],
    ) {
        return first.some(
            (interest) =>
                second.includes(
                    interest,
                ),
        );
    }
}