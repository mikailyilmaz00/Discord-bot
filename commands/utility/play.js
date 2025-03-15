const { Client, GatewayIntentBits } = require("discord.js");
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const distube = new DisTube(client, {
    plugins: [new YtDlpPlugin(), new SpotifyPlugin(), new SoundCloudPlugin()],
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    emitNewSongOnly: true,
});

client.once("ready", () => {
    console.log("✅ Borobot is online!");
});

// handles commands
client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("!")) return;

    const args = message.content.split(" ");
    const command = args.shift().toLowerCase();
    const songName = args.join(" ");
    console.log(`Command: ${command}, Song Name: ${songName}`);  // debug

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        return message.reply("⚠️ You have to join a voice channel!");
    }

    switch (command) {
        case "!play":
            distube.play(voiceChannel, songName, {
                member: message.member,
                textChannel: message.channel,
                message
            });
            break;

        case "!skip":
            distube.skip(message);
            message.reply("⏩ Skipping to the next song in queue!");
            break;

        case "!pause":
            distube.pause(message);
            message.reply("⏸ The song is paused.");
            break;

        case "!resume":
            distube.resume(message);
            message.reply("▶ The song is back on.");
            break;

        case "!stop":
            distube.stop(message);
            message.reply("🛑 Borobot has left the voice channel.");
            break;

        case "!queue":
            const queue = distube.getQueue(message);
            if (!queue) {
                message.reply("📭 The queue is empty.");
            } else {
                message.reply(`🎵 **Queue:**\n${queue.songs.map((song, id) => `${id + 1}. ${song.name} - \`${song.formattedDuration}\``).join("\n")}`);
            }
            break;

        case "!remove":
            if (!args[0] || isNaN(args[0]) || args[0] < 1) {
                return message.reply("⚠️ You need to give a valid number for the song in queue.");
            }
            const songIndex = parseInt(args[0]) - 1;
            const queueToRemove = distube.getQueue(message);
            if (songIndex >= queueToRemove.songs.length) {
                return message.reply("⚠️ You need to give a valid number for the song in queue.");
            }
            const removedSong = queueToRemove.songs.splice(songIndex, 1);
            message.reply(`❌ Removed song: ${removedSong[0].name}`);
            break;

        case "!clear":
            distube.stop(message);
            message.reply("🗑 Queue has been cleared.");
            break;

        case "!volume":
            if (!args[0] || isNaN(args[0])) {
                return message.reply("⚠️ You need to provide a valid volume level (0 to 200).");
            }
            const newVolume = parseInt(args[0]);
            distube.setVolume(message, newVolume);
            message.reply(`🔊 Volume set to ${newVolume}%`);
            break;

        case "!volup":
            const currentVolumeUp = distube.getQueue(message).volume;
            distube.setVolume(message, currentVolumeUp + 20);
            message.reply(`🔊 Volume increased to ${currentVolumeUp + 20}%`);
            break;

        case "!voldown":
            const currentVolumeDown = distube.getQueue(message).volume;
            distube.setVolume(message, currentVolumeDown - 20);
            message.reply(`🔊 Volume decreased to ${currentVolumeDown - 20}%`);
            break;

        default:
            message.reply("⚠️ Unknown command.");
            break;
    }
});

distube
    .on("playSong", (queue, song) => queue.textChannel.send(`🎶 Playing: ${song.name} - \`${song.formattedDuration}\``))
    .on("addSong", (queue, song) => queue.textChannel.send(`🎶 Added to queue: ${song.name} - \`${song.formattedDuration}\``))
    .on("error", (channel, error) => channel.send(`⚠️ An error encountered: ${error.message}`));

client.login(token);