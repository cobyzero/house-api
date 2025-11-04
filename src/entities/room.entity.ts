import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { House } from './house.entity';
import { Device } from './device.entity';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  house_id: number;

  @Column({ default: 20 })
  temperature: number;

  @Column({ default: false })
  light: boolean;

  @Column({ default: false })
  ventilation: boolean;

  @ManyToOne(() => House, (house) => house.rooms)
  house: House;

  @OneToMany(() => Device, (device) => device.room)
  devices: Device[];
}
