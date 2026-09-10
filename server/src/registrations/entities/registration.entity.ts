import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from '../../events/entities/event.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Event)
  event: Event;

  @CreateDateColumn()
  createdAt: Date;
}
