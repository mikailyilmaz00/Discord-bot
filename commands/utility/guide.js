const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guide')
        .setDescription('Search for a command description')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Select a command')
                .setRequired(true)
                .addChoices(
                    { name: 'ping', value: 'ping' },
                    { name: 'guide', value: 'guide' },
                    { name: 'recipe', value: 'recipe' },
                    { name: 'reload', value: 'reload' },
                    { name: 'gif', value: 'gif' },
                    { name: 'echo', value: 'echo' },
                    { name: 'messages', value: 'messages' },
                    { name: 'news', value: 'news' },
                    { name: 'play', value: 'play' },
                    { name: 'skip', value: 'skip' },
                    { name: 'pause', value: 'pause' },
                    { name: 'resume', value: 'resume' },
                    { name: 'stop', value: 'stop' },
                    { name: 'queue', value: 'queue' },
                    { name: 'remove', value: 'remove' },
                    { name: 'clear', value: 'clear' },
                    { name: 'server', value: 'server' },
                    { name: 'user', value: 'user' },
					{ name: 'quiz', value: 'quiz' },
					{ name: 'magic8ball', value: 'magic8ball' },
					{ name: 'sayings', value: 'sayings' }
                )),
    async execute(interaction) {
        const command = interaction.options.getString('command');

        const commandDescription = {
            ping: {
                title: 'ping',
                description: `
Enables or disables the autoplay system.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
Must be in a voice channel
A music must be currently playing
Must be in the same voice channel as me

For detailed information about a command, use: /guide <command>.
`
            },
            guide: {
                title: 'guide',
                description: `
The \`guide\` command guides you find information about the available commands and how to use them.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`
            },
            recipe: {
                title: 'recipe',
                description: `
The \`recipe\` command allows you to search for meal recipes based on a specified query.
**Arguments**
- \`query\`: The search term for the recipe.
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`
            },
            reload: {
                title: 'reload',
                description: `
The \`reload\` command is used to reload a command.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`
            },
            gif: {
                title: 'gif',
                description: `
The \`gif\` command allows you to send a random gif based on a specified query.
**Arguments**
- \`query\`: The search term for the gif.
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`
            },
            echo: {
                title: 'echo',
                description: `
The \`echo\` command allows you to send a message.
**Arguments**
- \`message\`: The message to send.
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`
            },
            messages: {
                title: 'messages',
                description: `
The \`messages\` command allows you to express your thoughts and feeling in a fun way.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`
            },
            news: {
                title: 'news',
                description: `
The \`news\` command allows you to search for news articles based on a specified query.
**Arguments**
- \`query\`: The search term for the news articles.
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`
            },
            play: {
                title: 'play',
                description: `
The \`!play\` command allows you to play music in a voice channel.
**Arguments**
- \`song\`: The song to play.
**Requirements**
Must be in a voice channel

For detailed information about a command, use: /guide <command>.
`
            },
            skip: {
                title: 'skip',
                description: `
The \`!skip\` command allows you to skip the currently playing song.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
Must be in a voice channel
A music must be currently playing

For detailed information about a command, use: /guide <command>.
`
            },
            pause: {
                title: 'pause',
                description: `
The \`!pause\` command allows you to pause the currently playing song.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
Must be in a voice channel
A music must be currently playing

For detailed information about a command, use: /guide <command>.
`
            },
            resume: {
                title: 'resume',
                description: `
The \`!resume\` command allows you to resume the currently paused song.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
Must be in a voice channel
A music must be currently playing

For detailed information about a command, use: /guide <command>.
`
            },
            stop: {
                title: 'stop',
                description: `
The \`!stop\` command allows you to stop the currently playing song.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
Must be in a voice channel
A music must be currently playing

For detailed information about a command, use: /guide <command>.
`
            },
            queue: {
                title: 'queue',
                description: `
The \`!queue\` command allows you to view the current song queue.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
Must be in a voice channel
A music must be currently playing

For detailed information about a command, use: /guide <command>.
`
            },
            remove: {
                title: 'remove',
                description: `
The \`!remove\` command allows you to remove a song from the queue.
**Arguments**
- \`song\`: The song to remove.
**Requirements**
Must be in a voice channel
A music must be currently playing

For detailed information about a command, use: /guide <command>.
`
            },
            clear: {
                title: 'clear',
                description: `
The \`!clear\` command allows you to clear the song queue.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
Must be in a voice channel
A music must be currently playing

For detailed information about a command, use: /guide <command>.
`
            },
            server: {
                title: 'server',
                description: `
The \`server\` command provides information about the server.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`
            },
            user: {
                title: 'user',
                description: `
The \`user\` command provides information about the user.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`

            },
            user: {
                title: 'user',
                description: `
The \`quiz\` command is a question about the creator of Borobot.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`

            },
            user: {
                title: 'user',
                description: `
The \`magic8ball\` command makes Borobot answer your question.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`

            },
            user: {
                title: 'user',
                description: `
The \`sayings\` command gives you a random joke, fact or quote.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`


            },
            user: {
                title: 'user',
                description: `
The \`spin\` command lets Borobot spin the wheel for you with an immidiate answer.
**Arguments**
You don't need to provide any arguments for this command!
**Requirements**
None

For detailed information about a command, use: /guide <command>.
`
            },
        };

        const description = commandDescription[command.toLowerCase()];
        if (description) {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(description.title)
                .setDescription(description.description);
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply('No description found for this command.');
        }
    }
};