import { EventEmitter } from 'node:events';
import {
    Collection,
    Client,
    MessagePayload,
    MessageReplyOptions,
} from 'discord.js';

import {
    CommandOptions,
    CommandHandlerOptions,
} from './interfaces';

export type resolvedCommand = string
                            | MessagePayload
                            | boolean;

export type CommandReturnOptions = Promise<
        string
        | [MessagePayload | MessageReplyOptions, boolean?]
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
    private _registerCommands(): Promise<void>;
    private Log<T>(message: string | T, error?: boolean): void;
}
