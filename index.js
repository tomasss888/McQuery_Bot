const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'GUILD_PRESENCES', 'GUILD_MEMBERS'] });
const { statusCommand, updateEmbed } = require("./commands/setup/embed.js")
const { setupCommand } = require("./commands/setup/setup.js")
const { deleteCommand } = require("./commands/delete.js")
const { deployCommands } = require("./deploy-commands.js")

const config = require('./config.js');

client.once('ready', () => {
    //deploys command names
    deployCommands();
    console.log('Bot is Ready!!!');
});


client.on('interactionCreate', async (interaction) => {

    // checks if interaction is defined command
    if (!interaction.isCommand()) return;

    // Only person with this role can use this bot
    if (interaction.guild.roles.cache.find(r => r.id === 976894316918227024)) {
        await interaction.reply("Administrator permissions required");
        return;
    }

    const { commandName } = interaction;

    if (commandName === 'status') {
        //await statusCommand(interaction);
    }
    if (commandName === 'setup') {
        console.log("Command setup initiated")
        ip = await setupCommand(client, interaction);
    }
    if (commandName === 'delete') {
        console.log("Command delete initiated")
        await deleteCommand(interaction, config.ip);
    }


});

client.login(config.bot.botKey);
