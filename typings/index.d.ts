import { EventEmitter } from 'node:events';
import {
    Collection,
    Client,
} from 'discord.js';

import {
    CommandOptions,
    CommandHandlerOptions,
} from './interfaces'

export class CommandHandler extends EventEmitter {
    public client: Client;
    public options: CommandHandlerOptions;

    private commands: Collection<string, CommandOptions>;

    public constructor(client: Client, 
                       options: CommandHandlerOptions);
    private _start(): void;
    private _registerCommands(): void;
    private Log(message: string, error?: boolean): void;
}
