const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'GUILD_PRESENCES', 'GUILD_MEMBERS'] });
const { statusCommand, updateEmbed } = require("./commands/setup/embed.js")
const { setupCommand } = require("./commands/setup/setup.js")
const { deleteCommand } = require("./commands/delete.js")
const { helpCommand } = require("./commands/help.js")
const { } = require("./deploy-commands.js")

const config = require('./data/config.js');

client.once('ready', () => {

    console.log('Bot is Ready!!!');

});

client.on('interactionCreate', async (interaction) => {

    // checks if interaction is defined command
    if (!interaction.isCommand()) return;

    // Only person with administrator permissions can call to command
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
        await interaction.reply("Administrator permissions required");
        return;
    }

    const { commandName } = interaction;

    if (commandName === 'help') {
        await helpCommand(interaction);
    }
    if (commandName === 'setup') {
        console.log("Command setup initiated")
        ip = await setupCommand(client, interaction);
    }
    if (commandName === 'delete') {
        console.log("Command delete initiated")
        await deleteCommand(client, interaction);
    }

});

client.login(config.bot.botKey);
