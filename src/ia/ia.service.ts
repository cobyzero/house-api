import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CommandService } from 'src/command/command.service';
import { SERIAL_PORT_ENABLE } from 'src/core/constants';
import { CacheService } from 'src/cache/cache.service';
import { DOMOTIC_SYSTEM_PROMPT } from 'src/core/constants';
@Injectable()
export class IaService {
  constructor(
    private readonly commandService: CommandService,
    private readonly cacheService: CacheService,
  ) {}
  private readonly apiUrl = 'https://api.deepseek.com/chat/completions';
  private readonly token = 'sk-e126109d47754eb7b7ef3bf50c5586f2';
  private readonly modelId = 'deepseek-chat';

  async processCommand(input: string) {
    const cached = this.cacheService.getCached(input);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (SERIAL_PORT_ENABLE) {
        this.commandService.sendCommand(parsed.command);
      }
      return parsed;
    }
    const response = await axios.post(
      `${this.apiUrl}`,
      {
        model: this.modelId,
        messages: [
          {
            role: 'system',
            content: DOMOTIC_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: input,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const command = response.data.choices[0].message.content;
    const jsonCommand = JSON.parse(command);
    this.cacheService.saveCache(input, JSON.stringify(jsonCommand));
    if (SERIAL_PORT_ENABLE) {
      this.commandService.sendCommand(jsonCommand.command);
    }
    return jsonCommand;
  }
}
