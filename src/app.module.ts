import { Module } from '@nestjs/common';
import { CommandModule } from './command/command.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HouseModule } from './house/house.module';
import { House } from './entities/house.entity';
import { Room } from './entities/room.entity';
import { Device } from './entities/device.entity';
import { IaModule } from './ia/ia.module';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [
    CommandModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      entities: [User, House, Room, Device],
      synchronize: true,
      database: 'postgres',
      username: 'postgres.evjxyyijpcnvqfdihjdx',
      password: 'wvzEtMUcrjtYsgBm',
      host: 'aws-1-us-east-1.pooler.supabase.com',
      port: 6543,
    }),
    HouseModule,
    IaModule,
  ],
  providers: [CacheService],
})
export class AppModule {}
