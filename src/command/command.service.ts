import { Injectable } from '@nestjs/common';
@Injectable()
export class CommandService {
  convertToCommand(text: string): string {
    return text;
  }

  sendCommand(command: string) {
    console.log(command);
  }
}
