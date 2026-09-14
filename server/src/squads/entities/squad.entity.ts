import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { SquadMember } from './squad-member.entity.js';
export enum SquadStatus {
    OPEN = 'open',
    FORMED = 'formed',
}

@Entity('squads')
export class Squad {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cityId: number;

    @Column()
    categoryId: number;

    @Column()
    groupSizeMin: number;

    @Column()
    groupSizeMax: number;

    @Column('text', {
        array: true,
        default: '{}',
    })
    interests: string[];

    @Column({
        type: 'enum',
        enum: SquadStatus,
        default: SquadStatus.OPEN,
    })
    status: SquadStatus;

    @OneToMany(
        'SquadMember',
        (member: SquadMember) => member.squad,
    )
    members: SquadMember[];

    @CreateDateColumn()
    createdAt: Date;
}