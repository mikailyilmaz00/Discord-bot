const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('messages')
        .setNameLocalizations({
            da: 'beskeder',
            tr: 'mesajlar',
            fr: 'messages',
            de: 'nachrichten',
        })
        .setDescription('Express your thoughts and emotions in a fun way.')
        .setDescriptionLocalizations({
            da: 'Udtryk dine tanker og følelser på en sjov måde.',
            tr: 'Düşüncelerinizi ve duygularınızı eğlenceli bir şekilde ifade edin.',
            fr: 'Exprimez vos pensées et émotions de manière amusante.',
            de: 'Drücke deine Gedanken und Gefühle auf eine lustige Weise aus.',
        })
        .addStringOption(option =>
            option.setName('gg')
                .setNameLocalizations({
                    da: 'godt-spil',
                    tr: 'iyi-oyun',
                    fr: 'bon-jeu',
                    de: 'gutes-spiel',
                })
                .setDescription('A way to congratulate someone for a good game!')
        )
        .addStringOption(option =>
            option.setName('joke')
                .setNameLocalizations({
                    da: 'vittighed',
                    tr: 'şaka',
                    fr: 'blague',
                    de: 'witz',
                })
                .setDescription('Tell a random joke to lighten the mood!')
        )
        .addStringOption(option =>
            option.setName('mood')
                .setNameLocalizations({
                    da: 'humør',
                    tr: 'ruh-hali',
                    fr: 'humeur',
                    de: 'stimmung',
                })
                .setDescription('Share how you’re feeling right now.')
        ),

    async execute(interaction) {
        const gg = interaction.options.getString('gg');
        const joke = interaction.options.getString('joke');
        const mood = interaction.options.getString('mood');

        const ggResponses = [
            "GG! You’re built different! 🔥",
            "That was a 200 IQ play! GG! 🧠💡",
            "You carried harder than Goku on Namek! GG! 💪🔥",
            "Flawless victory! GG! 🏆",
            "You played like an esports pro! GG! 🎮",
            "They never saw it coming... GG! 😎",
            "One does not simply win… unless it’s you. GG! 🏅"
        ];

        const jokeResponses = [
            "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾😆",
            "Why don’t skeletons fight each other? Because they don’t have the guts! 💀😂",
            "What do you call fake spaghetti? An impasta! 🍝🤣",
            "Why do cows wear bells? Because their horns don’t work! 🐄🔔",
            "Why don’t eggs tell jokes? Because they might crack up! 🥚😄",
            "Why did the gamer stay up all night? Because the loot wasn’t going to collect itself! 🎮🛑",
            "I told my suitcase that there will be no vacations this year… now I’m dealing with emotional baggage. 🧳😢"
        ];

        const moodResponses = [
            "You’re doing great, keep going! 🚀",
            "No rain, no flowers! Keep pushing through! 🌧️🌸",
            "Progress is progress, no matter how small! 💯",
            "You’re the protagonist of your own story! 📖✨",
            "Even the hardest levels can be beaten. Stay strong! 🎮💪",
            "Don’t forget to take care of yourself! You matter. ❤️",
            "If Naruto never gave up, why should you? BELIEVE IT! 🌀🔥"
        ];

        if (gg) {
            return interaction.reply(ggResponses[Math.floor(Math.random() * ggResponses.length)]);
        } else if (joke) {
            return interaction.reply(jokeResponses[Math.floor(Math.random() * jokeResponses.length)]);
        } else if (mood) {
            return interaction.reply(moodResponses[Math.floor(Math.random() * moodResponses.length)]);
        }

        return interaction.reply('You used the /messages command! 🎉');
    }
};
