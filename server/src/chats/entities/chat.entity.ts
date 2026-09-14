import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from '../../events/entities/event.entity.js';
import type { Squad } from '../../squads/entities/squad.entity.js';
import type { ChatParticipant } from './chat-participant.entity.js';
import type { Message } from './message.entity.js';

export enum ChatType {
    EVENT = 'event',
    SQUAD = 'squad',
    ADMIN = 'admin',
}

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ChatType,
    })
    type: ChatType;

    @ManyToOne(
        () => Event,
        {
            nullable: true,
            onDelete: 'CASCADE',
        },
    )
    event: Event | null;

    @ManyToOne(
        'Squad',
        {
            nullable: true,
            onDelete: 'CASCADE',
        },
    )
    squad: Squad | null;

    @OneToMany(
        'ChatParticipant',
        (participant: ChatParticipant) => participant.chat,
    )
    participants: ChatParticipant[];

    @OneToMany(
        'Message',
        (message: Message) => message.chat,
    )
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;
}