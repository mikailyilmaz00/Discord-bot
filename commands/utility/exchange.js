const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { exchangeKEY } = require('../../config.json'); // Add your API key to config.json

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exchange')
        .setDescription('Convert currency from one type to another')
        .addStringOption(option =>
            option.setName('from')
                .setDescription('The currency to convert from (e.g., USD)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('to')
                .setDescription('The currency to convert to (e.g., EUR)')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription('The amount to convert')
                .setRequired(true)
        ),
    async execute(interaction) {
        const fromCurrency = interaction.options.getString('from').toUpperCase();
        const toCurrency = interaction.options.getString('to').toUpperCase();
        const amount = interaction.options.getNumber('amount');

        try {
            // Fetch exchange rate data
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/${exchangeKEY}/latest/${fromCurrency}`);
            const rates = response.data.conversion_rates;

            if (!rates[toCurrency]) {
                return interaction.reply(`Invalid target currency: ${toCurrency}`);
            }

            const exchangeRate = rates[toCurrency];
            const convertedAmount = (amount * exchangeRate).toFixed(2);

            // Create an embed message
            const exchangeEmbed = new EmbedBuilder()
                .setTitle('Currency Exchange')
                .setDescription(`Exchange rate from ${fromCurrency} to ${toCurrency}`)
                .addFields(
                    { name: 'From', value: fromCurrency, inline: true },
                    { name: 'To', value: toCurrency, inline: true },
                    { name: 'Amount', value: `${amount} ${fromCurrency}`, inline: true },
                    { name: 'Converted Amount', value: `${convertedAmount} ${toCurrency}`, inline: true },
                    { name: 'Exchange Rate', value: `1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`, inline: true }
                )
                .setColor('#00FF00')
                .setFooter({ text: 'Exchange rate data provided by ExchangeRate' });

            return interaction.reply({ embeds: [exchangeEmbed] });
        } catch (error) {
            console.error('Error fetching exchange rate data:', error);
            return interaction.reply('Could not fetch exchange rate data. Please try again later.');
        }
    },
};