const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require('../../config.json');
const play = require('play-dl');
const ffmpeg = require('ffmpeg-static');
process.env.FFMPEG_PATH = ffmpeg;

const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus 
} = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let queue = [];
let player = createAudioPlayer();
let connection = null;

// When the bot is ready
client.once("ready", () => {
    console.log("✅ Borobot is online!");
});

// Play the next song in the queue
const playNext = () => {
    if (queue.length === 0) {
        connection.destroy();
        connection = null;
        return;
    }

    const song = queue.shift();
    const stream = ytdl(song, { 
        filter: "audioonly",
        highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream);

    player.play(resource);
};

// Handle commands

client.on("messageCreate", async (message) => {

    if (!message.content.startsWith("!")) return;

    const args = message.content.split(" ");
    const command = args[0].toLowerCase();
    const songName = args.slice(1).join(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        return message.reply("⚠️ You have to join a voice channel!");
    }

    switch (command) {
        case "!play":
            let songUrl = songName;
            
            if (!ytdl.validateURL(songName)) {
                const searchResults = await play.search(songName, { limit: 1 });
                if (searchResults.length === 0) {
                    return message.reply('Could not find a song with that name.');
                }
                songUrl = searchResults[0].url;
            }

            queue.push(songUrl);

            if (queue.length === 1 && !connection) {
                message.reply(`🎶 Playing: ${songName}`);
                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });

                connection.subscribe(player);
                playNext();
            } else {
                message.reply(`🎶 Added to queue: ${songName}`);
            }
            break;
            

        case "!skip":
            if (queue.length > 0) {
                message.reply("⏩ Skipping to the next song in queue!");
                playNext();
            } else {
                message.reply("⚠️ No songs in queue.");
            }
            break;

        case "!pause":
            player.pause();
            message.reply("⏸ The song is paused.");
            break;

        case "!resume":
            player.unpause();
            message.reply("▶ The song is back on.");
            break;

        case "!stop":
            queue = [];
            player.stop();
            connection.destroy();
            connection = null;
            message.reply("🛑 Borobot has left the voice channel.");
            break;

        case "!queue":
            console.log("Queue command received. Current queue:", queue); 
            if (queue.length === 0) {
                message.reply("📭 The queue is empty.");
            } else {
                let queueMessage = "🎵 **Queue:**\n";
                queue.forEach((song, index) => {
                    queueMessage += `${index + 1}. ${song}\n`;
                });
                message.reply(queueMessage);
            }
            break;

        case "!remove":
            if (!args[1] || isNaN(args[1]) || args[1] < 1 || args[1] > queue.length) {
                return message.reply("⚠️ You need to give a valid number for the song in queue.");
            }
            const removedSong = queue.splice(args[1] - 1, 1);
            message.reply(`❌ Removed song: ${removedSong}`);
            break;

        case "!clear":
            queue = [];
            message.reply("🗑 Queue has been cleared.");
            break;

        default:
            message.reply("⚠️ Unknown command.");
            break;
    }
});

player.on(AudioPlayerStatus.Idle, () => {
    playNext();
});

client.login(token);