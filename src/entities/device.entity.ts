import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  room_id: number;

  @Column({ default: 20 })
  temperature: number;

  @Column({ default: false })
  light: boolean;

  @Column({ default: false })
  ventilation: boolean;

  @Column({ default: false })
  alarm: boolean;

  @Column({ nullable: false })
  pinId: number;

  @Column({ default: false })
  doorOpen: boolean;

  @ManyToOne(() => Room, (room) => room.devices)
  room: Room;
}
