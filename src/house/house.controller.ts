import { Controller, Post, Body, Get } from '@nestjs/common';
import { HouseService } from './house.service';
import { ResponseBase } from 'src/core/responses/response.base';

@Controller('house')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Post('findUserHouse')
  async findUserHouse(@Body('userId') userId: number): Promise<ResponseBase> {
    return await this.houseService.findUserHouse(userId);
  }

  @Post('createRoom')
  async createRoom(
    @Body('houseId') houseId: number,
    @Body('name') name: string,
  ): Promise<ResponseBase> {
    return await this.houseService.createRoom(houseId, name);
  }

  @Post('findDevicesByHouseId')
  async findDevicesByHouseId(
    @Body('houseId') houseId: number,
  ): Promise<ResponseBase> {
    return await this.houseService.findDevicesByHouseId(houseId);
  }

  @Post('createDevice')
  async createDevice(
    @Body('roomId') roomId: number,
    @Body('name') name: string,
    @Body('pinId') pinId: number,
  ): Promise<ResponseBase> {
    return await this.houseService.createDevice(roomId, name, pinId);
  }

  @Post('findDevicesByRoomId')
  async findDevicesByRoomId(
    @Body('roomId') roomId: number,
  ): Promise<ResponseBase> {
    return await this.houseService.findDevicesByRoomId(roomId);
  }

  @Post('lightDevice')
  async lightDevice(
    @Body('deviceId') deviceId: number,
    @Body('light') light: boolean,
  ): Promise<ResponseBase> {
    return await this.houseService.lightDevice(deviceId, light);
  }

  @Post('ventilationDevice')
  async ventilationDevice(
    @Body('deviceId') deviceId: number,
    @Body('ventilation') ventilation: boolean,
  ): Promise<ResponseBase> {
    return await this.houseService.ventilationDevice(deviceId, ventilation);
  }

  @Post('findRoomsByHouseId')
  async findRoomsByHouseId(
    @Body('houseId') houseId: number,
  ): Promise<ResponseBase> {
    return await this.houseService.findRoomsByHouseId(houseId);
  }

  @Post('setupPins')
  async setupPins(@Body('houseId') houseId: number): Promise<ResponseBase> {
    return await this.houseService.setupPins(houseId);
  }

  @Post('manageDoor')
  async manageDoor(@Body('deviceId') deviceId: number): Promise<ResponseBase> {
    return await this.houseService.manageDoor(deviceId);
  }

  @Post('manageAlarm')
  async manageAlarm(@Body('deviceId') deviceId: number): Promise<ResponseBase> {
    return await this.houseService.manageAlarm(deviceId);
  }

  @Get('hello')
  async helloHouse(): Promise<ResponseBase> {
    return ResponseBase.success('Hello House', 'Hello House');
  }
}
