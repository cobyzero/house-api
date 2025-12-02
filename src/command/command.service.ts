import { Injectable } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { SERIAL_PORT_ENABLE, SERIAL_PORT_PATH } from 'src/core/constants';
@Injectable()
export class CommandService {
  private serialPort: SerialPort;
  constructor() {
    if (SERIAL_PORT_ENABLE) {
      this.serialPort = new SerialPort({
        path: SERIAL_PORT_PATH,
        baudRate: 9600,
        lock: false,
      });
    }
  }
  convertToCommand(text: string): string {
    return text;
  }

  sendCommand(command: string) {
    if (!SERIAL_PORT_ENABLE) {
      return;
    }
    try {
      if (!this.serialPort) {
        this.serialPort = new SerialPort({
          path: SERIAL_PORT_PATH,
          baudRate: 9600,
          lock: false,
        });
      }
      this.serialPort.write(command + '\n');
    } catch (error) {
      console.error(error);
    }
  }
}
