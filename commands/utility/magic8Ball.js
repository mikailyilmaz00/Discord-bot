const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('magic8ball')
        .setDescription('Ask the Magic 8-Ball a question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Ask your question')
                .setRequired(true)),
    async execute(interaction) {
        const answers = [
            'Yes.',
            'No.',
            'Maybe.',
            'Ask again later.',
            'Definitely not.',
            'Absolutely!',
            'I think so.',
            'I doubt it.',
            'Sure!',
            'Of course!',
            'You should know the answer to that.',
            'Bro, why are you asking me?',
            'Hello? I\'m a ball, not a mind reader.',
            'What them flippin\' coins.',
            'It is time to sleep.',
            'You know it is time to go to bed when you ask something like this.',
            'I am not sure, ask me again',
            'Lol, you are funny.',
            'you are a genius, you know the answer.',
            'please, ask me something else.',
            'w3schools is the best place to learn.',
            'coding is fun.',
            'I am a bot, I am not a human.',
            'vaccines are good for you.',
            'keep calm and code on.',
            'æøå is the best letters in the world.',
            'your brain is the best computer.',
            'your brain is not working, mine is not working either. Ask me something else. Are you a bot?',
            'I know you are a bot, you know I am a bot, so why are we talking?',
            'You should know the answer to that, but i will tell you, the answer is yes.',
            'If you ever feel useless, remember that there is a bot that is answering questions like this.',
            'if you need someones help, ask a human, not a bot.',
            'ayy lmao',
            'haha, you are funny',
            'okay, I will tell you the answer, the answer is no.',
            'Roses are red, violets are blue, I am a bot, and I am talking to you.',
            'roses are red, bots are very cool, why are you asking me, you are a fool.',
            'My name is Borobot, and i will be happy to answer your question. The answer depends on what color your socks are.',
            'Well, i don\'t know, but i would like to know, why don\'t you ask chatGPT?',
            'My friend, you are asking the wrong person, when my buddy, chatGPT is here.',
            'Okay, now you are just asking me random questions, it is time to stop. Goodbye. I am going to sleep. Don\'t wake me up.',
            'If it is a yes or no question, the answer is yes.',
            'If it is a yes or no question, the answer is no.',
            'If it is a yes or no question, the answer is maybe.',
            'If you support Real Madrid, DON\'T ASK ME ANYTHING.',
            'The sky is blue, the grass is green, you are asking me questions, that are not clean.',
            'I am a bot, you are a human, you are asking me questions, that are not human.',
            'Yo bro actually, let me tell you a secret while you ask me this question, I am a bot. Do you really think that bots can answer questions like this?',
            'Just saying, you would be better off asking chatGPT, not me.'

        ];

        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
        await interaction.reply(randomAnswer);
    }
};
