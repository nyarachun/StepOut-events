import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import type { Squad } from './squad.entity.js';

@Entity('squad_members')
@Unique([
    'squad',
    'user',
])
export class SquadMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        'Squad',
        (squad: Squad) => squad.members,
        {
            onDelete: 'CASCADE',
        },
    )
    squad: Squad;

    @ManyToOne(
        () => User,
        {
            onDelete: 'CASCADE',
        },
    )
    user: User;
}