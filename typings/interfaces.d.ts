/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Message } from 'discord.js';

export interface CommandHandlerOptions {
    path: string;
    prefix: string;
    log?: boolean;
}

export interface CommandOptions {
    name: string;

    reqArgs?: number;

    execute(
        message: Message, 
        args?: Array<string>, 
        client?: Client
    ): Promise<any>;
}
