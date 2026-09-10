import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { Category } from '../../categories/entities/category.entity.js';
import { City } from '../../cities/entities/city.entity.js';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  date: Date;

  @Column()
  address: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column()
  capacity: number;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  organizer: User;

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => City)
  city: City;
}
