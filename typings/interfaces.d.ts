import {
    Client,
    Message
} from 'discord.js';

import {
    CommandReturnOptions,
} from './index';

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
    ): CommandReturnOptions;
}
