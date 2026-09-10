import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { Event } from '../../events/entities/event.entity.js';

@Entity('favorites')
@Unique(['user', 'event'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
  })
  event: Event;
}
