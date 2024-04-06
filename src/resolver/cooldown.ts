import { setTimeout as sleep } from 'node:timers/promises';

import { Message } from 'discord.js';

import {
    CommandHandlerOptions,
    CommandOptions,
} from '../../typings/interfaces';
import { CooldownsCollection, RelativeTimeFormat } from '../../typings';

export default async function resolveCooldown(
    message: Message,
    commands: CommandOptions,
    options: CommandHandlerOptions,
    cooldowns: CooldownsCollection
): Promise<boolean> {
    const cooldownOpt = options.cooldown;
    const defaultCooldown = cooldownOpt.defaultCooldown;
    const commandCooldown = (commands.cooldown! ?? defaultCooldown) * 1_000;

    const cooldown = cooldowns.get(commands.name)!;
    if (!cooldown?.has(message.author.id)) {
        cooldown.set(message.author.id, Date.now());
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, commandCooldown);
    }

    const cooldownTime = cooldown.get(message.author.id)!;
    const currentTime = Date.now();

    if (!(cooldownTime < currentTime)) return false;

    const expirationTime = Math.round(((cooldownTime + commandCooldown) / 1_000));
    const expirationFormatted = `<t:${expirationTime}:R>` as RelativeTimeFormat;

    if (cooldownOpt.message && typeof cooldownOpt.message === 'function') {
        cooldownOpt.message(message, expirationFormatted);
    } else if (cooldownOpt.message && typeof cooldownOpt.message === 'string') {
        const cooldownText = cooldownOpt.message.replaceAll(
            '{cooldown}',
            expirationFormatted
        );
        const cooldownMessage = await message.reply({
            content: cooldownText,
        });

        await sleep(3_000);
        if (cooldownMessage.deletable) await cooldownMessage.delete();
    }

    return true;
}
