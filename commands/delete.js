
const { InteractionType, InteractionResponseType } = require("discord-api-types/v9");
const config = require('../data/config.js');
const { stopUpdatingEmbed } = require("./setup.js");

module.exports = {
    name: 'delete',
    async execute(interaction) {

        try {

            await stopUpdatingEmbed();

            // // Set Bot Status
            await interaction.client.user.setPresence({
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
        } finally {
            await interaction.reply("Successfully deleted");
        }

    }
}