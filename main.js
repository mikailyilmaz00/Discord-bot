const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token, foodChannelId, newsChannelId } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { sendNewsAutomatically } = require('./commands/utility/news');
const { listenToMessages } = require('./commands/utility/food'); 
// const axios = require('axios')
// const qs = require('qs')



const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent
	] });

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



client.login(token);

client.once('ready', () => {
	// console.log(`Ready! Logged in as ${client.user.tag}`)
	const channelId = newsChannelId

	setInterval(() => {
		sendNewsAutomatically(client, channelId)
	}, 3600000);

	sendNewsAutomatically(client, channelId)
});





client.on('messageCreate', async (message) => {
	if (message.content) {
	  console.log('Message content:', message.content); 
	  console.log('Channel ID:', message.channel.id);    
	  if (message.channel.id === foodChannelId) {
		await listenToMessages(message); // listen for messages only in the correct channel
	  }
	}
  });
  



  