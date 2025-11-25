import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IaService {
  private readonly apiUrl = 'https://router.huggingface.co/models';
  private readonly token = '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';
  private readonly modelId = 'cobyzero/llama32-domotica';
  async processCommand(input: string) {
    const response = await axios.post(
      `${this.apiUrl}/${this.modelId}`,
      {
        inputs: `Usuario: ${input}\nAsistente:`,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.1,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return this.parseResponse(response.data[0].generated_text);
  }

  private parseResponse(text: string) {
    const commandMatch = text.match(/command:\s*(.+?)(?:\n|$)/i);
    const responseMatch = text.match(/response:\s*(.+?)(?:\n|$)/i);

    return {
      command: commandMatch?.[1].trim() || 'unknown',
      response: responseMatch?.[1].trim() || text,
    };
  }
}
