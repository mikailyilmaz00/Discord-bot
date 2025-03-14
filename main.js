const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const foodChannelId = process.env.FOOD_CHANNEL_ID;
const newsChannelId = process.env.NEWS_CHANNEL_ID;

const fs = require('node:fs');
const path = require('node:path');
const { sendNewsAutomatically } = require('./commands/utility/news');
const { listenToMessages } = require('./commands/utility/food');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ] 
});

client.cooldowns = new Collection();
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.once('ready', () => {
    const channelId = newsChannelId;

    setInterval(() => {
        sendNewsAutomatically(client, channelId);
    }, 4900000);

    sendNewsAutomatically(client, channelId);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith("!")) return;

    const args = message.content.slice(1).split(" ");
    const command = args.shift().toLowerCase();

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel && ['play', 'skip', 'pause', 'resume', 'stop', 'queue', 'remove', 'clear', 'volume', 'volup', 'voldown'].includes(command)) {
        return message.reply("⚠️ You have to join a voice channel!");
    }

    switch (command) {
        case 'play':
        case 'skip':
        case 'pause':
        case 'resume':
        case 'stop':
        case 'queue':
        case 'remove':
        case 'clear':
        case 'volume':
        case 'volup':
        case 'voldown':
            const playCommand = require('./commands/utility/play');
            await playCommand.execute(message, args);
            break;
        default:
            message.reply("⚠️ Unknown command.");
            break;
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
});

client.login(token);