import * as fs from 'node:fs';
import { Collection, Client } from 'discord.js';
import { EventEmitter } from 'node:events';

import {
    CommandOptions,
    CommandHandlerOptions,
} from '../typings/interfaces';

export default class CommandHandler extends EventEmitter {
    public client: Client;
    public options: CommandHandlerOptions;

    private commands: Collection<string, CommandOptions>;

    public constructor(client: Client, 
                       options: CommandHandlerOptions) {
        super();
        this.client = client;
        this.options = options;

        this.commands = new Collection();

        if (this.options.log !== false) {
            this.on('logs', console.log);
        }

        this._start();
    }

    private _start(): void {
        this._registerCommands();

        this.client.on('messageCreate', async (message) => {
            const prefix = this.options.prefix;
            const args = message.content
                .slice(prefix.length)
                .trim()
                .split(/\s+/);
            const command = args.shift()
                ?.toLowerCase();
            if (!message.content.startsWith(prefix)) return;

            const commands = this.commands.get(command!);
            if (!commands) return;

            try {
                await commands.execute(message, args, this.client);
            } catch (err) {
                // @ts-ignore
                this.Log(err, true);
            }
        });
    }

    private _registerCommands(): void {
        const path = this.options.path;

        const commandFiles = fs.readdirSync(path)
            .filter((file) => file.endsWith('.js'));

        this.Log('Registering Commands...');

        if (this.options.log !== false) {
            console.time('Command(s) Register Time');
        }

        commandFiles.forEach((file) => {
            const command: CommandOptions = require(`${path}/${file}`);

            this.commands.set(command.name, command);
        });

        if (this.options.log !== false) {
            console.timeEnd('Command(s) Register Time');
        }

        this.Log('Registered Commands.');
    }

    private Log(message: string, error?: boolean): void {
        if (!error) {
            this.emit('logs', `[INFO] [Command Handler]: ${message}`);
        }
        else if (error && error === true) {
            this.emit('logs', `[ERROR] [Command Handler]: ${message}`);
        }
    }
}
