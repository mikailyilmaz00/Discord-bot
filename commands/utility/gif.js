const { SlashCommandBuilder } = require('discord.js');
const { giphyKEY } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Sends a random gif!')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The gif category')
                .setRequired(true)
                .addChoices(
                    { name: 'Funny', value: 'funny' },
                    { name: 'Meme', value: 'meme' },
                    { name: 'Movie', value: 'movie' },
                    { name: 'Anime', value: 'anime' },
                    { name: 'Animal', value: 'animal' },
                    { name: 'Serious', value: 'serious' },
                    { name: 'Reaction', value: 'reaction' },
                    { name: 'Turkish', value: 'turkish' },
					{ name: 'Naruto', value: 'naruto'}
                )),
    async execute(interaction) {
        const category = interaction.options.getString('category');

        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphyKEY}&q=${category}&limit=10&rating=g`);
            const data = await response.json();

            if (!response.ok) {
                return interaction.reply(`Error fetching GIF: ${response.statusText}`);
            }

            if (!data.data || !data.data.length === 0) {
                return interaction.reply('Could not find a GIF for that category.');
            }

			//random gif
            const randomIndex = Math.floor(Math.random() * data.data.length);
            const gifUrl = data.data[randomIndex].images.original.url;

            await interaction.reply(gifUrl);
        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error fetching a GIF.');
        }
    }
};
