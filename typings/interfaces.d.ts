import {
    Client,
    Message
} from 'discord.js';

import {
    CommandReturnOptions,
    RelativeTimeFormat,
} from './index';

export type CooldownMessageOptions =
    // eslint-disable-next-line
    ((message: Message, expirationTime: RelativeTimeFormat) => Promise<any>)
    | string; 

export interface CooldownOptions {
    defaultCooldown: number;
    // eslint-disable-next-line
    message: CooldownMessageOptions;
}

export interface CommandHandlerOptions {
    path: string;
    prefix: string;
    log?: boolean;

    cooldown: CooldownOptions;
}

export interface CommandOptions {
    name: string;
    reqArgs?: number;
    cooldown?: number;

    execute(
        message: Message, 
        args?: Array<string>, 
        client?: Client
    ): CommandReturnOptions;
}
