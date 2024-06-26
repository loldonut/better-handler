import * as fs from 'node:fs';
import {
    Collection,
    Client,
} from 'discord.js';
import { EventEmitter } from 'node:events';

import {
    CommandOptions,
    CommandHandlerOptions,
} from '../typings/interfaces';
import {
    resolvedCommand,
} from '../typings/index.d';

export default class CommandHandler extends EventEmitter {
    public client: Client;
    public options: CommandHandlerOptions;

    private commands: Collection<string, CommandOptions>;

    /**
     * @typedef {Object} CommandHandlerOptions
     *
     * @property {string} path - Path to your Commands
     * @property {string} prefix - Prefix of the Bot
     * @property {boolean} [log] - If you want to log Command Handler states
     */

    /**
     * A Command Handler for your discord bot
     *
     * @param {Client} client
     * @param {CommandHandlerOptions} options
     */
    public constructor(client: Client, options: CommandHandlerOptions) {
        super();
        this.client = client;
        this.options = options;

        this.commands = new Collection();

        if (this.options.log !== false) {
            this.on('logs', console.log);
        }

        this._start();
    }

    /**
     * Starts the command handler
     * @private
     */
    private _start(): void {
        this._registerCommands();

        this.client.on('messageCreate', async (message) => {
            const prefix = this.options.prefix;
            const args = message.content
                .slice(prefix.length)
                .trim()
                .split(/\s+/g);
            const command = args.shift()?.toLowerCase();
            if (!message.content.startsWith(prefix)) return;

            const commands = this.commands.get(command!); // eslint-disable-line
            if (!commands) return;

            const isCommandValid = this.resolveCommand(
                commands, 
                args
            );

            switch (typeof isCommandValid) {
            /* eslint-disable indent */
                case 'object':
                    await message.reply(isCommandValid);
                    return;

                case 'string':
                    await message.reply({
                        content: isCommandValid,
                    });
                    return;

                case 'boolean':
                    if (isCommandValid !== true) return;
                    else break;
            }
            /* eslint-enable */

            try {
                const executedCMD = await commands.execute(message, args, this.client);
                if (!executedCMD) return;

                if (typeof executedCMD === 'string') {
                    await message.reply({
                        content: executedCMD,
                    });
                }
                else if (Array.isArray(executedCMD)) {
                    if (!executedCMD.length) return;

                    if (!executedCMD[1]) {
                        await message.channel.send(executedCMD[0]);
                    }
                    else if (executedCMD[1] === true) {
                        await message.reply(executedCMD[0]);
                    } else {
                        await message.reply(executedCMD[0]);
                    }
                }
                /* eslint-enable */
            } catch (err) {
                this.Log<typeof err>(err, true);
            }
        });
    }

    /**
     * @typedef {string|MessageOptions|boolean} resolvedCommand
     */

    /**
     * Resolves a command by checking if the user or the bot is able to run the commmand
     *
     * @param {CommandOptions} command
     * @param {Array<string>} args
     *
     * @returns {resolvedCommand}
     */
    public resolveCommand(command: CommandOptions, args: Array<string>): resolvedCommand {
        if (command.reqArgs && args.length < command.reqArgs) {
            return {
                content: `**Not enough arguments passed!**\n(Need ${command.reqArgs} got ${args.length})`,
            };
        }

        return true;
    }

    /**
     * Registers your command(s)
     * @private
     */
    private async _registerCommands(): Promise<void> {
        const path = this.options.path;

        const commandFiles = fs.readdirSync(path)
            .filter((file) => file.endsWith('.js'));

        this.Log('Registering Commands...');

        for (const file of commandFiles) {
            const command = ((await import(`${path}/${file}`)).default) as CommandOptions; // eslint-disable-line

            this.commands.set(command.name, command);
            this.Log(`Loaded command ${command.name}`);
        }

        this.Log('Registered Commands.');
    }

    /**
     * Logs/Emits to event `logs`
     *
     * @param {string|T} message
     * @param {boolean} [error]
     */
    private Log<T>(message: string | T , error?: boolean): void {
        if (!error) {
            this.emit('logs', `[INFO] [Command Handler]: ${message}`);
        }
        else if (error && error === true) {
            this.emit('logs', `[ERROR] [Command Handler]: ${message}`);
        }
    }
}
