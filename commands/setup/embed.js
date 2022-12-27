const { MessageEmbed } = require('discord.js');
const { sleep, getMcData } = require("../../functions/common.js");
const config = require('../../data/config.js');

var hostname;
var port;
var autoUpdateEmbed = null;

function setupEmbed(ip, portNumber, client, interaction) {

    hostname = ip;
    port = portNumber;
    // create initial embed and save embed id to config
    var statusEmbed = new MessageEmbed()
        .setTitle("Loading...")
        .setDescription("...");
    config.channelID.embed = statusEmbed.id;

    // Initiates Interval to keep updating created embed
    interaction.guild.channels.cache.get(config.channelID.infoChannel).send({ embeds: [statusEmbed] }).then((msg) => {
        // updateEmbed(client, interaction, function (embed) {
        //     msg.edit({ embeds: [embed] });
        // });
        autoUpdateEmbed = setInterval(async function () {
            await updateEmbed(client, interaction, function (embed, file) {
                msg.edit({
                    embeds: [embed],
                    files: [file]
                });
            });
        }, 15000)
    })
}

// Stops Updating Embed
function stopUpdatingEmbed() {
    clearInterval(autoUpdateEmbed);
}

// Fetches data and updates embed
async function updateEmbed(client, interaction, callback) {

    getMcData(hostname, port)
        .then(async (json) => {

            file = {
                attachment: Buffer.from(config.server.favicon.split(',')[1], 'base64'),
                name: 'favicon.png'
            }


            // // Set Bot Status
            await client.user.setPresence({
                status: 'dnd',
                activities: [{
                    type: (json.online) ? 'WATCHING' : 'Server',
                    name: (json.online) ? `${json.players.online} `+ (json.players.online == 1 ? `player` : `players`) +` playing ` : "is Offline"
                }]
            })

            try {
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
            }
            catch (error) {
                console.log(error)
            }

            // green #78b159
            // red  #dd2e44

            // Create embed
            try {
                if (json.online) {
                    embed = await new MessageEmbed()
                        .setColor("#78b159")
                        .setTitle("🟢 Online - " + json.hostname + "")
                        .setDescription(json.motd.clean)
                        .addFields(
                            { name: '**Version: ' + json.version + "**", value: "----------------------------------------------------------------------" },
                            { name: `Players Online: ${json.players.online} out of ${json.players.max}`, value: players + '\n' + "----------------------------------------------------------------------" },
                            { name: `Plugins Used:`, value: plugins + '\n' + "----------------------------------------------------------------------" },
                        )
                        .setTimestamp()
                        .setFooter({ text: 'Updated every 15 seconds' })
                        .setThumbnail('attachment://favicon.png');

                } else {
                    embed = await new MessageEmbed()
                        .setColor("#dd2e44")
                        .setTitle("🔴 Offline - " + json.hostname + "")
                        .setTimestamp()
                        .setFooter({ text: 'Updated every 15 seconds' })
                        .setThumbnail('attachment://favicon.png');
                }
            }
            catch (error) {
                console.log(error)
            }

            // Set Channel names
            // try {
            //     interaction.guild.channels.cache.get(config.channelID.onlineChannel).setName(((json.online) ? "🟢 Online" : "🔴 Offline"));
            //     interaction.guild.channels.cache.get(config.channelID.playersChannel).setName((json.online) ? ("🐕 " + "Players online : " + json.players.online) : "Players online : -");
            // }
            // catch (error) {
            //     console.log(error)
            // }

            await callback(embed, file);
        })
        .catch((error) => console.error(error));

}



module.exports = { setupEmbed, stopUpdatingEmbed };