import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { House } from './house.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @OneToOne(() => House, (house) => house.user)
  @JoinColumn()
  house: House;
}
