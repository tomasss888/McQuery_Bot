
const config = require('./config.js');
const { Client, Intents } = require('discord.js')
const { REST } = require('@discordjs/rest');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const rest = new REST({ version: '9' }).setToken(config.bot.botKey);
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

function deployCommands() {

    const commands = [
        new SlashCommandBuilder().setName('status')
            .setDescription('Shows MC server status'),
        new SlashCommandBuilder().setName('setup')
            .setDescription('Setup status channels')
            .addStringOption(option =>
                option.setName('ip')
                    .setDescription('ip of your server')
                    .setRequired(true)),
        new SlashCommandBuilder().setName('delete')
            .setDescription('Deletes created channels by setup'),
    ]
        .map(command => command.toJSON());

    rest.put(Routes.applicationGuildCommands(config.bot.clientId, config.bot.guildId), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);

}

module.exports = { deployCommands }