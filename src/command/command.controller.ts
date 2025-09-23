import { Controller, Post, Body } from '@nestjs/common';
import { CommandService } from './command.service';

@Controller('command')
export class CommandController {

    constructor(private readonly commandService: CommandService) { }

    @Post()
    receiveCommand(@Body('text') text: string) {
        try {
            const cmd = this.commandService.convertToCommand(text);
            return { status: "ok", command: cmd };
        } catch (error) {
            return { status: "error", message: error.message };
        }
    }
}
