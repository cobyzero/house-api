import { Controller, Post, Body } from '@nestjs/common';
import { IaService } from './ia.service';

@Controller('ia')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  @Post('message')
  async processCommand(@Body('message') message: string) {
    return await this.iaService.processCommand(message);
  }
}
