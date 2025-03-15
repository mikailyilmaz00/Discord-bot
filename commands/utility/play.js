// const { Client, GatewayIntentBits } = require("discord.js");
// require('dotenv').config();
// const token = process.env.DISCORD_TOKEN;
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

let queue = [];
let player = createAudioPlayer();
let connection = null;
let volume = 1.0; // 1.0 == 100%

const setVolume = (newVolume) => {
    volume = Math.max(0, Math.min(newVolume, 2));
    if (player.state.status === AudioPlayerStatus.Playing) {
        const resource = player.state.resource;
        resource.volume.setVolume(volume);
    }
};

const playNext = () => {
    if (queue.length === 0) {
        connection.destroy();
        connection = null;
        return;
    }

    const song = queue.shift();
    const stream = ytdl(song, { filter: 'audioonly', highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream, { inlineVolume: true });
    resource.volume.setVolume(volume);

    player.play(resource);
};

module.exports = {
    data: {
        name: 'play',
        description: 'Play music from YouTube',
    },
    async execute(message, args) {
        const command = args.shift().toLowerCase();
        const songName = args.join(' ');

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('⚠️ You have to join a voice channel!');
        }

        switch (command) {
            case '!play':
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

            case '!skip':
                if (queue.length > 0) {
                    message.reply('⏩ Skipping to the next song in queue!');
                    playNext();
                } else {
                    message.reply('⚠️ No songs in queue.');
                }
                break;

            case '!pause':
                player.pause();
                message.reply('⏸ The song is paused.');
                break;

            case '!resume':
                player.unpause();
                message.reply('▶ The song is back on.');
                break;

            case '!stop':
                queue = [];
                player.stop();
                connection.destroy();
                connection = null;
                message.reply('🛑 Stopped playing music.');
                break;

            case '!queue':
                if (queue.length === 0) {
                    message.reply('📭 The queue is empty.');
                } else {
                    let queueMessage = '🎵 **Queue:**\n';
                    queue.forEach((song, index) => {
                        queueMessage += `${index + 1}. ${song}\n`;
                    });
                    message.reply(queueMessage);
                }
                break;

            case '!remove':
                if (!args[0] || isNaN(args[0]) || args[0] < 1 || args[0] > queue.length) {
                    return message.reply('⚠️ You need to give a valid number for the song in queue.');
                }
                const removedSong = queue.splice(args[0] - 1, 1);
                message.reply(`❌ Removed song: ${removedSong}`);
                break;

            case '!clear':
                queue = [];
                message.reply('🗑 Queue has been cleared.');
                break;

            case '!volume':
                if (!args[0] || isNaN(args[0])) {
                    return message.reply('⚠️ You need to provide a valid volume level (0 to 200).');
                }
                const newVolume = parseFloat(args[0]) / 100;
                setVolume(newVolume);
                message.reply(`🔊 Volume set to ${args[0]}%`);
                break;

            case '!volup':
                setVolume(volume + 0.2);
                message.reply(`🔊 Volume increased to ${(volume * 100).toFixed(0)}%`);
                break;

            case '!voldown':
                setVolume(volume - 0.2);
                message.reply(`🔊 Volume decreased to ${(volume * 100).toFixed(0)}%`);
                break;

            default:
                message.reply('⚠️ Unknown command.');
                break;
        }
    },
};

player.on(AudioPlayerStatus.Idle, () => {
    playNext();
});