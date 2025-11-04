import { Module } from '@nestjs/common';
import { CommandModule } from './command/command.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HouseModule } from './house/house.module';
import { House } from './entities/house.entity';
import { Room } from './entities/room.entity';
import { Device } from './entities/device.entity';

@Module({
  imports: [
    CommandModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      entities: [User, House, Room, Device],
      synchronize: true,
      database: 'neondb',
      username: 'neondb_owner',
      password: 'npg_Q8wPFAVspjt3',
      host: 'ep-icy-grass-a4z5lyfj-pooler.us-east-1.aws.neon.tech',
      port: 5432,
      ssl: true,
    }),
    HouseModule,
  ],
})
export class AppModule {}
