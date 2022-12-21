const config = require('../../config.js');
const { setupEmbed } = require("./embed.js");
const console = require('console');
const { sleep, getMcData, getFavicon } = require("../../functions/common.js");



async function setupCommand(client, interaction) {

    const ip = interaction.options.getString('ip');
    const port = interaction.options.getString('port') ?? 25565;

    interaction.reply({ content: "Setup initiated", ephemeral: true });


    getFavicon(ip, port)
        .then(async (result) => {
            config.server.favicon = result.favicon;
            await createChannels(interaction, ip);  // creates channels
            await setupEmbed(ip, port, client, interaction);  // setups embed inside channel

        })
        .catch((error) => console.error(error));



}

async function createChannels(interaction, ip) {

    everyoneRole = await interaction.guild.roles.cache.find(r => r.name === '@everyone');

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
    // const onlineChannel = await interaction.guild.channels.create(((json.online) ? "🟢 Online" : "🔴 Offline"), {
    //     type: 'GUILD_VOICE',
    //     parent: category,
    //     permissionOverwrites: [
    //         {
    //             id: everyoneRole.id,
    //             deny: ['CONNECT'],
    //         },
    //     ]
    // });
    // // Player count channel
    // const playersChannel = await interaction.guild.channels.create((json.online) ? ("🐕 " + "Players online : " + json.players.online) : "Players online : -", {
    //     type: 'GUILD_VOICE',
    //     parent: category,
    //     permissionOverwrites: [
    //         {
    //             id: everyoneRole.id,
    //             deny: ['CONNECT'],
    //         },
    //     ]
    // });
    // Info/Status Channel
    const infoChannel = await interaction.guild.channels.create('⛏️ Server Status', {
        type: 'GUILD_TEXT',
        parent: category
    });

    // Save channels and category id's to config file
    config.channelID.category = await category.id;
    // config.channelID.onlineChannel = await onlineChannel.id;
    // config.channelID.playersChannel = await playersChannel.id;
    config.channelID.infoChannel = await infoChannel.id;


}


module.exports = { setupCommand }