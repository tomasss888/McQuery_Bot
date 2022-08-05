const { MessageEmbed } = require('discord.js');
const { sleep, getMcData } = require("../../functions/common.js");
const config = require('../../config.js');

var hostname;
var autoUpdateEmbed = null;

function setupEmbed(ip, client, interaction) {

    hostname = ip;
    // create initial embed and save embed id to config
    var statusEmbed = new MessageEmbed()
        .setTitle("Loading...")
        .setDescription("...");
    config.channelID.embed = statusEmbed.id;

    // Initiates Interval to keep updating created embed
    interaction.guild.channels.cache.get(config.channelID.infoChannel).send({ embeds: [statusEmbed] }).then((msg) => {
        updateEmbed(client, interaction, function (embed) {
            msg.edit({ embeds: [embed] });
        });
        autoUpdateEmbed = setInterval(async function () {
            updateEmbed(client, interaction, function (embed) {
                msg.edit({ embeds: [embed] });
            });
        }, 10000)
    })
}

function stopUpdatingEmbed(){
    clearInterval(autoUpdateEmbed);
}

// Fetches data and updates embed
async function updateEmbed(client, interaction, callback) {

    getMcData(hostname).then(async (json) => {

        // Set Bot Status
        client.user.setPresence({
            status: 'dnd',
            activities: [{
                type: (json.online) ? 'WATCHING' : 'Server',
                name: (json.online) ? `${json.players.online} players playing ` : "is Offline"
            }]
        })

        // Convert Multiple Objects into String
        var players = "none"
        if (json?.players?.list && !!Object.keys(json.players.list).length) {
            var array = new Array();
            json.players.list.forEach(element => { array.push("`" + element + "`") });
            players = array.join(" ");
        }
        var plugins = "none"
        if (json?.plugins && !!Object.keys(json.plugins).length) {
            var array = new Array();
            json.plugins.forEach(element => {
                var split = element.split(' ');
                array.push("`" + split[0] + "`")
            });
            plugins = array.join(" ");
        }

        // green #78b159
        // red  #dd2e44

        // Create embed
        if (json.online) {
            embed = new MessageEmbed()
                .setColor("#78b159")
                .setTitle("🟢 Online - " + json.hostname + "")
                .setDescription('**Version: ' + json.version + "**")
                .addFields(
                    { name: `Players Online: ${json.players.online} out of ${json.players.max}`, value: players },
                    { name: `Plugins Used:`, value: plugins },
                )
                .setTimestamp()
                .setFooter({ text: 'Updated every 10 seconds' })
                .setThumbnail('https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png');

        } else {
            embed = new MessageEmbed()
                .setColor("#dd2e44")
                .setTitle("🔴 Offline - " + json.hostname + "")
                .setTimestamp()
                .setFooter({ text: 'Updated every 10 seconds' })
                .setThumbnail('https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png');
        }

        // Set Channel names
        interaction.guild.channels.cache.get(config.channelID.onlineChannel).setName(((json.online) ? "🟢 Online" : "🔴 Offline"));
        interaction.guild.channels.cache.get(config.channelID.playersChannel).setName((json.online) ? ("🐕 " + "Players online : " + json.players.online) : "Players online : -");

        callback(await embed);
    })

}



module.exports = { setupEmbed, stopUpdatingEmbed };