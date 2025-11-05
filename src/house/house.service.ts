import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseBase } from 'src/core/responses/response.base';
import { House } from 'src/entities/house.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Room } from 'src/entities/room.entity';
import { Device } from 'src/entities/device.entity';
import { CommandService } from 'src/command/command.service';
import Commands from 'src/core/commands/commands';
import { SERIAL_PORT_ENABLE } from 'src/core/constants';

@Injectable()
export class HouseService {
  private serialPortEnable: boolean = false;

  constructor(
    @InjectRepository(House) private houseRepository: Repository<House>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    private commandService: CommandService,
  ) {
    try {
      console.log('Serial port enabled');
    } catch (error) {
      console.log('Serial port disabled');
    }
  }

  async findUserHouse(userId: number): Promise<ResponseBase> {
    const house = await this.houseRepository.findOne({
      where: { userId },
    });
    if (!house) {
      return await this.createHouse(userId, 'House');
    }
    return ResponseBase.success(house, 'House found');
  }

  async createHouse(userId: number, name: string): Promise<ResponseBase> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return ResponseBase.error('User not found');
    }
    const newHouse = this.houseRepository.create({ name, userId });
    await this.houseRepository.save(newHouse);
    return ResponseBase.success(newHouse, 'House created');
  }

  async createRoom(houseId: number, name: string): Promise<ResponseBase> {
    const house = await this.houseRepository.findOne({
      where: { id: houseId },
    });
    if (!house) {
      return ResponseBase.error('House not found');
    }
    const existRoom = await this.roomRepository.findOne({
      where: { name, house: { id: houseId } },
    });
    if (existRoom) {
      return ResponseBase.error('Room already exists');
    }
    const newRoom = this.roomRepository.create({
      name,
      house,
      house_id: houseId,
    });
    await this.roomRepository.save(newRoom);
    return ResponseBase.success(newRoom, 'Room created');
  }

  async findDevicesByHouseId(houseId: number): Promise<ResponseBase> {
    const house = await this.houseRepository.findOne({
      where: { id: houseId },
    });
    if (!house) {
      return ResponseBase.error('House not found');
    }
    const rooms = await this.roomRepository.find({
      where: { house_id: houseId },
    });
    const devices: Device[] = [];
    for (const room of rooms) {
      const device = await this.deviceRepository.find({
        where: { room_id: room.id },
      });
      devices.push(...device);
    }
    return ResponseBase.success(devices, 'Devices found');
  }

  async createDevice(
    roomId: number,
    name: string,
    pinId: number,
  ): Promise<ResponseBase> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    if (!room) {
      return ResponseBase.error('Room not found');
    }
    const existDevice = await this.deviceRepository.findOne({
      where: { name, room_id: roomId },
    });
    if (existDevice) {
      return ResponseBase.error('Device already exists');
    }
    const newDevice = this.deviceRepository.create({
      name,
      room,
      room_id: roomId,
      pinId,
    });
    await this.deviceRepository.save(newDevice);
    return ResponseBase.success(newDevice, 'Device created');
  }

  async findDevicesByRoomId(roomId: number): Promise<ResponseBase> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    if (!room) {
      return ResponseBase.error('Room not found');
    }
    const devices = await this.deviceRepository.find({
      where: { room_id: roomId },
    });
    return ResponseBase.success(devices, 'Devices found');
  }

  async lightDevice(deviceId: number, light: boolean): Promise<ResponseBase> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
    });
    if (!device) {
      return ResponseBase.error('Device not found');
    }
    device.light = light;
    await this.deviceRepository.save(device);

    if (this.serialPortEnable) {
      var command = light ? Commands.LIGHT_ON : Commands.LIGHT_OFF;
      this.commandService.convertToCommand(command + '.' + device.pinId);
    }
    return ResponseBase.success(device, 'Device light changed');
  }

  async ventilationDevice(
    deviceId: number,
    ventilation: boolean,
  ): Promise<ResponseBase> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
    });
    if (!device) {
      return ResponseBase.error('Device not found');
    }
    device.ventilation = ventilation;
    await this.deviceRepository.save(device);
    return ResponseBase.success(device, 'Device ventilation changed');
  }

  async findRoomsByHouseId(houseId: number): Promise<ResponseBase> {
    const house = await this.houseRepository.findOne({
      where: { id: houseId },
    });
    if (!house) {
      return ResponseBase.error('House not found');
    }
    const rooms = await this.roomRepository.find({
      where: { house_id: houseId },
    });
    return ResponseBase.success(rooms, 'Rooms found');
  }
}
