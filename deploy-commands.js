
const config = require('./data/config.js');
const { Client, Intents } = require('discord.js')
const { REST } = require('@discordjs/rest');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const rest = new REST({ version: '9' }).setToken(config.bot.botKey);
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [
    new SlashCommandBuilder().setName('help')
        .setDescription('Displays all commands'),
    new SlashCommandBuilder().setName('setup')
        .setDescription('Setup status channels')
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('IP address of your server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('port')
                .setDescription('Port number of your server')),
    new SlashCommandBuilder().setName('delete')
        .setDescription('Deletes created channels by setup'),
]
    .map(command => command.toJSON());


rest.put(Routes.applicationGuildCommands(config.bot.clientId, config.bot.guildId), { body: [] })
    .then(() => console.log('Successfully deleted all previous commands.'))
    .catch(console.error);

rest.put(Routes.applicationCommands(config.bot.clientId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);


