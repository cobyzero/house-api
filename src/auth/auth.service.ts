import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseBase } from '../core/responses/response.base';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async login(username: string, password: string): Promise<ResponseBase> {
    const user = await this.userRepository.findOneBy({ username, password });
    if (!user) {
      return ResponseBase.error('User not found');
    }
    return ResponseBase.success(user, 'User found');
  }

  async register(
    username: string,
    password: string,
    name: string,
  ): Promise<ResponseBase> {
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser) {
      return ResponseBase.error('User already exists');
    }
    const user = this.userRepository.create({ username, password, name });
    await this.userRepository.save(user);
    return ResponseBase.success(user, 'User created');
  }
}
