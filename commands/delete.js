
const { InteractionType, InteractionResponseType } = require("discord-api-types/v9");
const config = require('../config.js');

async function deleteCommand(interaction, ip) {


    try {

        await interaction.reply("Deleted successfully");

        if (config.channelID.category === "") {
            await interaction.reply("Nothing to delete");
            return
        }

        var category = await interaction.guild.channels.cache.get(config.channelID.category)
        await category.children.forEach(channel => channel.delete());
        await category.delete();

        
        config.channelID.category = "";
        config.channelID.onlineChannel = "";
        config.channelID.playersChannel = "";
        config.channelID.infoChannel = "";


    } catch (error) {
        console.log(error)
    }

}

module.exports = { deleteCommand }