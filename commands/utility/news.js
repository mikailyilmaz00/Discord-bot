const { SlashCommandBuilder } = require('discord.js');
const { NewsKEY } = require('../../config.json');

async function fetchNews(category) {
    const today = new Date()
    today.setDate(today.getDate() - 10)
    const fromDate = today.toISOString().split('T')[0]
    const response = await fetch(`https://newsapi.org/v2/everything?q=${category}&from=${fromDate}&sortBy=popularity&apiKey=${NewsKEY}`);
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));


    if (!response.ok) {
        throw new Error(`Error fetching news: ${response.statusText}`);
    }
    
    
    if (!data.articles || data.articles.length === 0) {
        throw new Error('Could not find News for that category.');
    }
    
    const article = data.articles[Math.floor(Math.random() * data.articles.length)];
    if (!article) {
        throw new Error('No valid article found.');
    }

    return {
        title: article.title || 'No title available',
        description: article.description || 'No description available',
         url: article.url || 'No URL available',
         imageUrl: article.urlToImage || 'https://via.placeholder.com/300' 
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Sends articles about your favorite topics!')
        .addStringOption(option =>
            option.setName('category')
            .setDescription('The topics category')
            .setRequired(true)
            .addChoices(
                { name: 'Software', value: 'Software' },
                { name: 'Data Science', value: 'Data Science' },
                { name: 'Cybersecurity', value: 'Cybersecurity' },
                { name: 'Artificial Intelligence', value: 'Artificial Intelligence' },
                { name: 'Football', value: 'Football' },
                { name: 'Anime', value: 'Anime' },
                { name: 'Danmark', value: 'Danske nyheder' },
                { name: 'Programming', value: 'Programming' },
                { name: 'Naruto', value: 'Naruto'}
            )),

            async execute(interaction) {
                const category = interaction.options.getString('category');
                
                try {
                    const news = await fetchNews(category)
                    await interaction.reply(`📰 **${news.title}**\n${news.description}\n🔗 [Read more](${news.url})\n📷 ${news.imageUrl}`);
                } catch (error) {
                    console.error(error)
                    await interaction.reply(error.message);

                }
            }
        }
        
        async function sendNewsAutomatically(client, channelId) {
            const channel = await client.channels.fetch(channelId)
            if(!channel) return console.error ('Channel not found!')
        
            const categories = ['Software', 'Data Science', 'Cybersecurity', 'Artificial Intelligence', 'Football', 'Anime', 'Danmark', 'Programming', 'Naruto']
            for (const category of categories) {
                try {
                    const news = await fetchNews(category);
                    if (news) {
                        await channel.send(`**${category}**\n📰 **${news.title}**\n${news.description}\n🔗 [Read more](${news.url})\n📷 ${news.imageUrl}\n`);
                    }
                } catch (error) {
                    console.error(`Could not find news for ${category}:`, error);
                }
            }
        }
        
    module.exports.sendNewsAutomatically = sendNewsAutomatically