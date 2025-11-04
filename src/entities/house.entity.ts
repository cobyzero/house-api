import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({ name: 'houses' })
export class House {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ default: 20 })
  temperature: number;

  @Column({ default: false })
  alarmActive: boolean;

  @OneToMany(() => Room, (room) => room.house)
  rooms: Room[];

  @OneToOne(() => User, (user) => user.house)
  user: User;

  @Column({ nullable: false })
  userId: number;
}
