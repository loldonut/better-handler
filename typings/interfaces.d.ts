import { Client, Message } from "discord.js";

export interface CommandHandlerOptions {
    path: string;
    prefix: string;
    log?: boolean;
}

export interface CommandOptions {
    name: string;

    execute(message: Message, 
            args?: Array<string>, 
            client?: Client): Promise<any>;
}
