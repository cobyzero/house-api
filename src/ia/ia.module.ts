import { Module } from '@nestjs/common';
import { IaController } from './ia.controller';
import { IaService } from './ia.service';
import { CommandService } from 'src/command/command.service';
import { CacheService } from 'src/cache/cache.service';
@Module({
  controllers: [IaController],
  providers: [IaService, CommandService, CacheService],
})
export class IaModule {}
