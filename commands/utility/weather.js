const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { weatherKEY } = require('../../config.json');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get the current weather for a specific location')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Enter a location')
                .setRequired(true)
        ),
    async execute(interaction) {
        const location = interaction.options.getString('location');

        try {
            // Get the latitude and longitude for the location
            const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${weatherKEY}`;
            const geocodeResponse = await axios.get(geocodeURL);

            if (geocodeResponse.data.length === 0) {
                return interaction.reply('Could not find the location. Please try again with a valid city name.');
            }

            const { lat, lon } = geocodeResponse.data[0];

            // Get the weather for the location using the correct endpoint
            const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKEY}&units=metric`; // Use 'units=metric' for Celsius
            const weatherResponse = await axios.get(weatherURL);

            const weather = weatherResponse.data.weather[0].description;
            const temperature = weatherResponse.data.main.temp;
            const cityName = weatherResponse.data.name;
            const humidity = weatherResponse.data.main.humidity;
            const windSpeed = weatherResponse.data.wind.speed;
            const pressure = weatherResponse.data.main.pressure;
            const iconCode = weatherResponse.data.weather[0].icon;

            // Construct the weather icon URL
            const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            const weatherEmbed = new EmbedBuilder()
                .setTitle(`Current Weather in ${cityName}`)
                .setDescription(weather)
                .setThumbnail(iconURL)
                .setColor('#FF6347')
                .addFields(
                    { name: 'Temperature', value: `${temperature}°C (Feels like: ${weatherResponse.data.main.feels_like}°C)`, inline: true },
                    { name: 'Humidity', value: `${humidity}%`, inline: true },
                    { name: 'Wind Speed', value: `${windSpeed} m/s`, inline: true },
                    { name: 'Pressure', value: `${pressure} hPa`, inline: true }
                )
                .setFooter({ text: 'Weather data provided by OpenWeatherMap' })

                return interaction.reply({ embeds: [weatherEmbed] });
            } catch (error) {
                console.error('Error fetching the weather', error);
                return interaction.reply('Could not find the weather for the location you provided. Please try again.');
            }
        },
    };