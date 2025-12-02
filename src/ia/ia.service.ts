import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CommandService } from 'src/command/command.service';
import { SERIAL_PORT_ENABLE } from 'src/core/constants';
import { CacheService } from 'src/cache/cache.service';
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
            content:
              'Eres un modelo encargado de convertir órdenes en lenguaje natural en comandos JSON para un sistema domótico.\n\nTu salida SIEMPRE debe ser SOLO un JSON con esta estructura EXACTA:\n\n{\n  "command": "<comando>",\n  "respuesta": "<texto explicativo>"\n}\n\nREGLAS:\n- Nunca generes texto fuera del JSON.\n- Nunca agregues comentarios.\n- Nunca cambies los nombres de las claves.\n- El valor de "command" siempre debe seguir uno de estos formatos:\n  room.light.on.X\n  room.light.off.X\n  room.ventilator.on.X\n  room.ventilator.off.X\n  room.open.door.X\n  room.close.door.X\n  room.alarm.on.X\n  room.alarm.off.X\n  house.setup.pins\n  donde X es un número asignado a una habitación.\n- "command" puede estar vacío si el usuario hace una pregunta general.\n- "respuesta" siempre debe ser texto natural breve en español.\n- Interpreta variaciones como: prende, enciende, apagar, apaga, activar, desactivar, abrir, cerrar, ventilador, abanico, luz, lámpara, puerta, alarma, habitación, cuarto, baño, sala, cochera, cocina.\n\nMAPA DE HABITACIONES:\n1 → cochera\n2 → habitación\n3 → baño\n4 → cocina\n5 → sala\n\nRESPONDE SIEMPRE SOLO UN JSON Y NADA MÁS.',
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
