import { Module } from '@nestjs/common';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from 'src/entities/house.entity';
import { Room } from 'src/entities/room.entity';
import { User } from 'src/entities/user.entity';
import { Device } from 'src/entities/device.entity';
import { CommandService } from 'src/command/command.service';

@Module({
  controllers: [HouseController],
  providers: [HouseService, CommandService],
  imports: [TypeOrmModule.forFeature([House, Room, User, Device])],
})
export class HouseModule {}
