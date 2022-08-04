const config = require('../../config.js');
const { setupEmbed } = require("./embed.js");
const console = require('console');
const { sleep, getMcData } = require("../../functions/common.js");



function setupCommand(client, interaction) {

    const ip = interaction.options.getString('ip');

    interaction.reply({ content: "Setup initiated", ephemeral: true });

    getMcData(ip).then(async (result) => {

        await createChannels(interaction, result, ip);
        setupEmbed(ip, client, interaction);

    })
        .catch((error) => console.error(error));

}

async function createChannels(interaction, json, ip) {

    everyoneRole = interaction.guild.roles.cache.find(r => r.name === '@everyone');

    // Category of channels
    const category = await interaction.guild.channels.create((ip + ' status'), {
        type: 'GUILD_CATEGORY',
        position: 0,
        permissionOverwrites: [
            {
                id: everyoneRole.id,
                deny: ['SEND_MESSAGES'],
            },
        ]
    });
    // Online players channel
    const onlineChannel = await interaction.guild.channels.create(((json.online) ? "🟢 Online" : "🔴 Offline"), {
        type: 'GUILD_VOICE',
        parent: category,
        permissionOverwrites: [
            {
                id: everyoneRole.id,
                deny: ['CONNECT'],
            },
        ]
    });
    // Player count channel
    const playersChannel = await interaction.guild.channels.create((json.online) ? ("🐕 " + "Players online : " + json.players.online) : "Players online : -", {
        type: 'GUILD_VOICE',
        parent: category,
        permissionOverwrites: [
            {
                id: everyoneRole.id,
                deny: ['CONNECT'],
            },
        ]
    });
    // Info/Status Channel
    const infoChannel = await interaction.guild.channels.create('⛏️ Info', {
        type: 'GUILD_TEXT',
        parent: category
    });

    // Save channels and category id's to config file
    config.channelID.category = category.id;
    config.channelID.onlineChannel = onlineChannel.id;
    config.channelID.playersChannel = playersChannel.id;
    config.channelID.infoChannel = infoChannel.id;

}


module.exports = { setupCommand }