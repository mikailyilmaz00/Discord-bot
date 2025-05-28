const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
const play = require("play-dl");
const youtubeCookie = process.env.YOUTUBE_COOKIES;
if (youtubeCookie) {
    play.setToken(youtubeCookie)
}
const ffmpeg = require("ffmpeg-static");
process.env.FFMPEG_PATH = ffmpeg;

const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let queue = [];
let player = createAudioPlayer();
let connection = null;
let currentTextChannel = null;
let volume = 1.0;

console.log("FFmpeg path:", process.env.FFMPEG_PATH); // debug

const setVolume = (newVolume) => {
  volume = Math.max(0, Math.min(newVolume, 2));
  if (player.state.status === AudioPlayerStatus.Playing && player.state.resource && player.state.resource.volume) {
    player.state.resource.volume.setVolume(volume);
  }
};

client.once("ready", () => {
  console.log("✅ Borobot is online!");
});

const playNext = async (textChannel) => {
  if (textChannel) currentTextChannel = textChannel;
  if (queue.length === 0) {
    if (connection) {
      connection.destroy();
      connection = null;
    }
    return;
  }

  const song = queue.shift();
  try {
    const stream = await play.stream(song, {discordPlayerCompatibility: true});
    console.log("stream:", stream); // debug
    const resource = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
    if (resource.volume) {
      resource.volume.setVolume(volume);
    }    
    player.play(resource);
    if (currentTextChannel) {
      currentTextChannel.send(`Now playing: ${song}`);
    }
  } catch (error) {
    console.error("Error fetching the song stream:", error);
    if (currentTextChannel) {
      currentTextChannel.send("⚠️ There was an error fetching the song. Please try again later.");
    }
    playNext();
  }
};

player.on(AudioPlayerStatus.Idle, () => {
  playNext();
});

player.on("error", error => {
  console.error("Audio player encountered an error:", error);
});
// handles commands
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!")) return;
  
  const args = message.content.split(" ");
  const command = args[0].toLowerCase();
  const songName = args.slice(1).join(" ");
  console.log(`Command: ${command}, Song Name: ${songName}`);

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return message.reply("⚠️ You have to join a voice channel!");
  }

  switch (command) {
    case "!play":
      let songUrl = songName;
      if (play.validate(songName) !== "yt") {
        const searchResults = await play.search(songName, { limit: 1 });
        if (searchResults.length === 0) {
          return message.reply("Could not find a song with that name.");
        }
        songUrl = searchResults[0].url;
      }
      queue.push(songUrl);
      if (!connection) {
        message.reply(`🎶 Playing: ${songName}`);
        currentTextChannel = message.channel;
        connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: message.guild.id,
          adapterCreator: message.guild.voiceAdapterCreator,
        });
        connection.subscribe(player);
        playNext(message.channel);
      } else {
        message.reply(`🎶 Added to queue: ${songName}`);
      }
      break;
    case "!skip":
      message.reply("⏩ Skipping to the next song in queue!");
      player.stop();
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
      if (connection) {
        connection.destroy();
        connection = null;
      }
      currentTextChannel = null;
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
    case "!volume":
      if (!args[1] || isNaN(args[1])) {
        return message.reply("⚠️ You need to provide a valid volume level (0 to 200).");
      }
      const newVolume = parseFloat(args[1]) / 100;
      setVolume(newVolume);
      message.reply(`🔊 Volume set to ${args[1]}%`);
      break;
    case "!volup":
      setVolume(volume + 0.2);
      message.reply(`🔊 Volume increased to ${(volume * 100).toFixed(0)}%`);
      break;
    case "!voldown":
      setVolume(volume - 0.2);
      message.reply(`🔊 Volume decreased to ${(volume * 100).toFixed(0)}%`);
      break;
    default:
      message.reply("⚠️ Unknown command.");
      break;
  }
});

client.login(token);
