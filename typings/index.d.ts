import { EventEmitter } from 'node:events';
import {
    Collection,
    Client,
    MessageCreateOptions,
    MessageReplyOptions,
    Snowflake,
    Message,
} from 'discord.js';

import { CommandOptions, CommandHandlerOptions } from './interfaces';

export type resolvedCommand = string | MessageCreateOptions | boolean;

export type CommandReturnOptions = Promise<
    string | [MessageCreateOptions | MessageReplyOptions, boolean?] | void
>;

export type CommandsCollection = Collection<string, CommandOptions>;
export type CooldownsCollection = Collection<
    string,
    Collection<Snowflake, number>
>;

export type RelativeTimeFormat = `<t:${number}:R>`;

export class CommandHandler extends EventEmitter {
    public client: Client;
    public options: CommandHandlerOptions;

    private commands: CommandsCollection;
    private cooldowns: CooldownsCollection;

    public constructor(client: Client, options: CommandHandlerOptions);

    public resolveCommand(
        message: Message,
        command: CommandOptions,
        args: Array<string>
    ): Promise<resolvedCommand>;

    private _start(): void;
    private _registerCommands(): Promise<void>;
    private _resolveCooldown(
        message: Message,
        commands: Collection<string, CommandOptions>
    ): Promise<void>;
    private Log<T>(message: string | T, error?: boolean): void;
}
