import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import type { Chat } from './chat.entity.js';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        'Chat',
        (chat: Chat) => chat.messages,
        {
            onDelete: 'CASCADE',
        },
    )
    chat: Chat;

    @ManyToOne(
        () => User,
        {
            nullable: true,
            onDelete: 'SET NULL',
        },
    )
    sender: User | null;

    @Column('text')
    text: string;

    @Column({
        default: false,
    })
    isSystem: boolean;

    @CreateDateColumn()
    createdAt: Date;
}