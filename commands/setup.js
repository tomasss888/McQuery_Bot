const { MessageEmbed } = require('discord.js');
const config = require('../data/config.js');
const console = require('console');
const { sleep, getMcData, getFavicon } = require("../functions/common.js");

var autoUpdateEmbed = null;

module.exports = {
    name: 'setup',
    // Stops Updating Embed
    stopUpdatingEmbed: function stopUpdatingEmbed() {
        clearInterval(autoUpdateEmbed);
    },
    async execute(interaction) {

        client = interaction.client;
        var ip = interaction.options.getString('ip');
        var port = interaction.options.getString('port') ?? 25565;

        interaction.reply({ content: "Setup initiated", ephemeral: true });

        getFavicon(ip, port)
            .then(async (result) => {
                config.server.favicon = result.favicon;
                await createChannels(interaction, ip);  // creates channels
                await setupEmbed(client, interaction);  // setups embed inside channel

            })
            .catch((error) => console.error(error));


        function setupEmbed(client, interaction) {

            // create initial embed and save embed id to config
            var statusEmbed = new MessageEmbed()
                .setTitle("Loading...")
                .setDescription("...");
            config.channelID.embed = statusEmbed.id;

            // Initiates Interval to keep updating created embed
            interaction.guild.channels.cache.get(config.channelID.infoChannel).send({ embeds: [statusEmbed] }).then((msg) => {
                autoUpdateEmbed = setInterval(function () {
                    updateEmbed(client, interaction, function (embed, file) {
                        msg.edit({
                            embeds: [embed],
                            files: [file]
                        });
                    });
                }, 15000)
            })
        }

        
        

        // Fetches data and updates embed
        async function updateEmbed(client, interaction, callback) {

            getMcData(ip, port)
                .then(async (json) => {

                    file = {
                        attachment: Buffer.from(config.server.favicon.split(',')[1], 'utf8'),
                        name: 'favicon.png'
                    }


                    // // Set Bot Status
                    await client.user.setPresence({
                        status: 'dnd',
                        activities: [{
                            type: (json.online) ? 'WATCHING' : 'Server',
                            name: (json.online) ? `${json.players.online} ` + (json.players.online == 1 ? `player` : `players`) + ` playing ` : "is Offline"
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
                                    { name: "\u200b", value: '**Version: ' + json.version + "**" }, 
                                    { name: `Players Online: ${json.players.online} out of ${json.players.max}`, value: players },
                                    { name: `Plugins Used:`, value: plugins },
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
    }
}
