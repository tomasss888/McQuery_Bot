

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        // checks if interaction is defined command
        if (!interaction.isCommand()) return;

        // Only person with administrator permissions can call to command
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            await interaction.reply("Administrator permissions required");
            return;
        }


        const command = interaction.client.commands.get(interaction.commandName);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }


    }
}