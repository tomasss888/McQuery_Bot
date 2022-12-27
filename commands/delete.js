
const { InteractionType, InteractionResponseType } = require("discord-api-types/v9");
const config = require('../data/config.js');
const { stopUpdatingEmbed } = require("./setup/embed.js");

async function deleteCommand(client, interaction) {


    try {

        await interaction.reply("Deleting channels");
        await stopUpdatingEmbed();

        if (config.channelID.category === "") {
            await interaction.reply("Nothing to delete");
            return
        }

        // // Set Bot Status
        await client.user.setPresence({
            status: 'dnd',
            activities: [{
                type: '',
                name: ''
            }]
        })

        // Deletes all created channels
        var category = await interaction.guild.channels.cache.get(config.channelID.category)
        await category.children.forEach(channel => channel.delete());
        await category.delete();

        // unassign all values 
        config.channelID.category = "";
        // config.channelID.onlineChannel = "";
        // config.channelID.playersChannel = "";
        config.channelID.infoChannel = "";


    } catch (error) {
        await interaction.reply("Failed to delete channels");
        console.log(error)
    }

}

module.exports = { deleteCommand }