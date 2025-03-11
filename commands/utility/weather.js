const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { weatherKEY } = require('../../config.json');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get the weather for a specific location')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Enter a location')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Choose the type of forecast')
                .setRequired(true)
                .addChoices(
                    { name: 'Current', value: 'current' },
                    { name: 'Hourly', value: 'hourly' },
                    { name: 'Daily', value: 'daily' },
                    { name: 'Past', value: 'past' }
                )
        )
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Enter a date (YYYY-MM-DD) for past weather')
                .setRequired(false)
        ),
    async execute(interaction) {
        const location = interaction.options.getString('location');
        const type = interaction.options.getString('type');
        const date = interaction.options.getString('date');

        if (type === 'past' && !date) {
            return interaction.reply('Please provide a date for past weather.');
        }

        if (type !== 'past' && date) {
            return interaction.reply('The date option is only valid for past weather.');
        }

        try {
            const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${weatherKEY}`;
            const geocodeResponse = await axios.get(geocodeURL);

            if (geocodeResponse.data.length === 0) {
                return interaction.reply('Could not find the location. Please try again with a valid city name.');
            }

            const { lat, lon } = geocodeResponse.data[0];

            let weatherURL;
            if (type === 'current') {
                weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKEY}&units=metric`;
            } else if (type === 'hourly') {
                weatherURL = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${weatherKEY}&units=metric`;
            } else if (type === 'daily') {
                weatherURL = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${weatherKEY}&units=metric`;
            } else if (type === 'past') {
                const end = Math.floor(new Date(date).getTime() / 1000);
                const start = end - (24 * 60 * 60); // 1 day ago
                weatherURL = `https://history.openweathermap.org/data/2.5/history/city?lat=${lat}&lon=${lon}&type=hour&start=${start}&end=${end}&appid=${weatherKEY}&units=metric`;
            }

            const weatherResponse = await axios.get(weatherURL);

            if (type === 'current') {
                const weather = weatherResponse.data.weather[0].description;
                const temperature = weatherResponse.data.main.temp;
                const cityName = weatherResponse.data.name;
                const humidity = weatherResponse.data.main.humidity;
                const windSpeed = weatherResponse.data.wind.speed;
                const pressure = weatherResponse.data.main.pressure;
                const iconCode = weatherResponse.data.weather[0].icon;

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
                    .setFooter({ text: 'Weather data provided by OpenWeatherMap' });

                return interaction.reply({ embeds: [weatherEmbed] });
            } else if (type === 'hourly') {
                const hourlyData = weatherResponse.data.list.slice(0, 12); // fetches next 12 hours
                const cityName = geocodeResponse.data[0].name;

                const hourlyEmbed = new EmbedBuilder()
                    .setTitle(`Hourly Weather Forecast for ${cityName}`)
                    .setColor('#FF6347')
                    .setFooter({ text: 'Weather data provided by OpenWeatherMap' });

                hourlyData.forEach((hour) => {
                    const date = new Date(hour.dt * 1000);
                    const hourString = `${date.getHours()}:00`;
                    const temperature = hour.main.temp;
                    const weather = hour.weather[0].description;
                    const iconCode = hour.weather[0].icon;
                    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                    hourlyEmbed.addFields(
                        { name: `${hourString}`, value: `${temperature}°C, ${weather}`, inline: true }
                    );
                });

                hourlyEmbed.setThumbnail(hourlyData[0].weather[0].icon ? `https://openweathermap.org/img/wn/${hourlyData[0].weather[0].icon}@2x.png` : '');

                return interaction.reply({ embeds: [hourlyEmbed] });
            } else if (type === 'daily') {
                const dailyData = weatherResponse.data.list.slice(0, 7); // fetches next 7 days
                const cityName = geocodeResponse.data[0].name;

                const dailyEmbed = new EmbedBuilder()
                    .setTitle(`Daily Weather Forecast for ${cityName}`)
                    .setColor('#FF6347')
                    .setFooter({ text: 'Weather data provided by OpenWeatherMap' });

                dailyData.forEach((day) => {
                    const date = new Date(day.dt * 1000);
                    const dayString = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const temperature = day.temp.day;
                    const weather = day.weather[0].description;
                    const iconCode = day.weather[0].icon;
                    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                    dailyEmbed.addFields(
                        { name: `${dayString}`, value: `${temperature}°C, ${weather}`, inline: true }
                    );
                });

                dailyEmbed.setThumbnail(dailyData[0].weather[0].icon ? `https://openweathermap.org/img/wn/${dailyData[0].weather[0].icon}@2x.png` : '');

                return interaction.reply({ embeds: [dailyEmbed] });
            } else if (type === 'past') {
                const pastData = weatherResponse.data.list.slice(0, 24); // fetches past 24 hours on the chosen date
                const cityName = geocodeResponse.data[0].name;

                const pastEmbed = new EmbedBuilder()
                    .setTitle(`Past Weather for ${cityName} on ${date}`)
                    .setColor('#FF6347')
                    .setFooter({ text: 'Weather data provided by OpenWeatherMap' });

                pastData.forEach((hour) => {
                    const date = new Date(hour.dt * 1000);
                    const hourString = `${date.getHours()}:00`;
                    const temperature = hour.main.temp;
                    const weather = hour.weather[0].description;
                    const iconCode = hour.weather[0].icon;
                    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                    pastEmbed.addFields(
                        { name: `${hourString}`, value: `${temperature}°C, ${weather}`, inline: true }
                    );
                });

                pastEmbed.setThumbnail(pastData[0].weather[0].icon ? `https://openweathermap.org/img/wn/${pastData[0].weather[0].icon}@2x.png` : '');

                return interaction.reply({ embeds: [pastEmbed] });
            }
        } catch (error) {
            console.error('Error fetching the weather', error);
            return interaction.reply('Could not find the weather for the location you provided. Please try again.');
        }
    },
};