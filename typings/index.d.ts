import { EventEmitter } from 'node:events';
import {
    Collection,
    Client,
    MessageOptions,
    MessagePayload,
    ReplyMessageOptions,
} from 'discord.js';

import {
    CommandOptions,
    CommandHandlerOptions,
} from './interfaces';

export type resolvedCommand = string
                            | MessageOptions
                            | boolean;

export type CommandReturnOptions = Promise<
        string
        | [MessageOptions | MessagePayload | ReplyMessageOptions, boolean?]
        | void
    >;

export class CommandHandler extends EventEmitter {
    public client: Client;
    public options: CommandHandlerOptions;

    private commands: Collection<string, CommandOptions>;

    public constructor(
        client: Client, 
        options: CommandHandlerOptions
    );

    public resolveCommand(
        command: CommandOptions,
        args: Array<string>
    ): resolvedCommand;

    private _start(): void;
    private _registerCommands(): void;
    private Log<T>(message: string | T, error?: boolean): void;
}
