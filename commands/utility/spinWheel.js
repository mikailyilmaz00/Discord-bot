// commands/spin.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spin')
        .setDescription('Spin the wheel with your own options!')
        .addStringOption(option =>
            option.setName('options')
                .setDescription('Type options separated by commas (e.g. option1, option2, option3)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const optionsString = interaction.options.getString('options');
        const options = optionsString.split(',').map(option => option.trim());

        if (options.length < 1) {
            return interaction.reply("⚠️ You need to type options seperated by commas.");
        }

        const result = options[Math.floor(Math.random() * options.length)];
        await interaction.reply(`🌀 **Spin the Wheel!** 🎰\n\nResult: ${result}`);
    },
}; 
