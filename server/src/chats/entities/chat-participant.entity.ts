import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import type { Chat } from './chat.entity.js';

@Entity('chat_participants')
@Unique(['chat', 'user'])
export class ChatParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    'Chat',
    (chat: Chat) => chat.participants,
    {
      onDelete: 'CASCADE',
    },
  )
  chat: Chat;

  @ManyToOne(
    () => User,
    {
      onDelete: 'CASCADE',
    },
  )
  user: User;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastReadAt: Date | null;
}