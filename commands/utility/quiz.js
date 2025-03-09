const  {SlashCommandBuilder} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('This is a one question quiz. What is the name of the creator of this bot?')
        .addStringOption(option =>
            option.setName('answer')
                .setDescription('Your answer')
                .setRequired(true)),
    async execute(interaction) {
        const correctAnswer = 'Mikail';
        const userAnswer = interaction.options.getString('answer');

        if (userAnswer === correctAnswer) {
            await interaction.reply('Correct! The answer is Mikail, He created me so I can be of service for you! That is a win-win situation!');
        } else {
            await interaction.reply('Incorrect! Try again.');
        }
    }
};
