const { SlashCommandBuilder, ChannelType,  } = require('discord.js');

module.exports = {
 data: new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setMaxLength(2_000))
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to echo into')
			.addChannelTypes(ChannelType.GuildText))
	.addBooleanOption(option =>
		option.setName('embed')
			.setDescription('Whether or not the echo should be embedded')),

    async execute(interaction) {
		console.log(interaction.options);

		const input = interaction.options.getString('input'); // For text
		const channel = interaction.options.getChannel('channel'); // For channel
		const embed = interaction.options.getBoolean('embed'); // For boolean

		if (channel) {
            if (embed) {
                await channel.send({ embeds: [{ description: input, color: 0x00ff00 }] });
            } else {
                await channel.send(input);
            }

          // sends message without sending a visible reply
            await interaction.deferReply({ ephemeral: true });
            await interaction.deleteReply(); // deletes the ephemeral reply immediately
        } else {
            // sends the message directly as a reply to the user
            if (embed) {
                await interaction.reply({ embeds: [{ description: input, color: 0x00ff00 }] });
            } else {
                await interaction.reply(input); // sends a plain text message
            }
        }
	}
}