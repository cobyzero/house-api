import { Injectable } from '@nestjs/common';
import { BayesClassifier } from 'natural';
import { SerialPort } from 'serialport';
@Injectable()
export class CommandService {
  constructor() {
    this.train();
  }
  classifier = new BayesClassifier();

  convertToCommand(text: string): string {
    try {
      if (typeof text !== 'string') {
        throw new Error(
          'Invalid input: expected a string field "text" in the request body.',
        );
      }
      const normalized = text.trim();
      console.log(normalized);
      const cmd = this.classifier.classify(normalized);
      this.sendCommand(cmd);
      return cmd;
    } catch (error) {
      console.error(error);
      return 'Error processing command';
    }
  }

  train() {
    this.classifier.addDocument(
      'prende la luz de la habitacion',
      'room.light.on',
    );
    this.classifier.addDocument('enciende la luz del cuarto', 'room.light.on');
    this.classifier.addDocument('ilumina la habitacion', 'room.light.on');
    this.classifier.addDocument(
      'apaga la luz de la habitacion',
      'room.light.off',
    );
    this.classifier.addDocument(
      'quita la luz del dormitorio',
      'room.light.off',
    );
    this.classifier.addDocument(
      'ya no quiero luz en la habitacion',
      'room.light.off',
    );
    this.classifier.addDocument('abre la puerta principal', 'unknown');
    this.classifier.addDocument('sube el volumen de la música', 'unknown');

    this.classifier.train();
  }

  sendCommand(command: string) {
    try {
      var port = new SerialPort({
        path: '/dev/cu.usbserial-3130',
        baudRate: 9600,
      });
      port.write(command + '\n');
    } catch (error) {
      console.error(error);
    }
  }
}
