
const { MessageEmbed } = require('discord.js');

async function helpCommand(interaction) {

   
    var embed = new MessageEmbed()
        .setColor(0x0fe473)
        .setTitle("Help | Commands 👋")
        .setDescription("**COMMANDS -**")
        .addFields(
            { name: '/help', value: 'Displays all the commands and their descriptions.', inline: false },
            { name: '/setup ip', value: 'Initiates minecraft server status channels creation. Place your minecraft server ip into the first argument.', inline: false },
            { name: '/delete', value: 'Deletes all channels created by setup command.', inline: false },
        );

    await interaction.reply({ embeds: [embed] });

    

}

module.exports = { helpCommand }