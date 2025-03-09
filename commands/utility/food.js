const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { foodKey, foodChannelId } = require('../../config.json');
const axios = require('axios');
// const qs = require('qs');

const getRecipes = async (query, maxFat = 65, number = 5) => {
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&maxFat=${maxFat}&number=${number}&apiKey=${foodKey}`;
  try {
    const response = await axios.get(url);
    console.log("API Response:", response.data)
    return response.data.results.map((recipe) => ({
      title: recipe.title,
      image: recipe.image,
      id: recipe.id,
    }));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return null;
  }
};

// slash command to fetch recipes based on user input
module.exports = {
    data: new SlashCommandBuilder()
      .setName('recipe')
      .setDescription('Get recipe suggestions based on a query')
      .addStringOption((option) =>
        option.setName('query').setDescription('What do you want to cook?').setRequired(true)
    )
        //   .addStringOption(option => 
        //     option.setName('cuisine')
        //       .setDescription('Specify a cuisine (e.g., Italian, Mexican)')
        //       .setRequired(false)
        //   )
        //   .addStringOption(option => 
        //     option.setName('exclude_cuisine')
        //       .setDescription('Exclude a specific cuisine (e.g., Greek, Indian)')
        //       .setRequired(false)
        //   )
        //   .addStringOption(option => 
        //     option.setName('diet')
        //       .setDescription('Specify a diet (e.g., vegetarian, keto)')
        //       .setRequired(false)
        //   )
        //   .addStringOption(option => 
        //     option.setName('intolerances')
        //       .setDescription('Specify intolerances (e.g., gluten, dairy)')
        //       .setRequired(false)
        //   )
        //   .addIntegerOption(option => 
        //     option.setName('min_sugar')
        //       .setDescription('Required sugar (e.g., The minimum amount of sugar, in grams per serving)')
        //       .setRequired(false)
        //   )

        //   .addIntegerOption(option => 
        //     option.setName('max_sugar')
        //       .setDescription('Required sugar (e.g., The maximum amount of sugar, in grams per serving)')
        //       .setRequired(false)

        //   )
        //   .addStringOption(option => 
        //     option.setName('include_ingredients')
        //       .setDescription('Ingredients that must be included (comma-separated)')
        //       .setRequired(false)
        //   )
        //   .addStringOption(option => 
        //     option.setName('exclude_ingredients')
        //       .setDescription('Ingredients to exclude (comma-separated)')
        //       .setRequired(false)
        //   )
        //   .addStringOption(option => 
        //     option.setName('type')
        //       .setDescription('Type of recipe (e.g., main course, dessert)')
        //       .setRequired(false)
        //   )
        //   .addBooleanOption(option => 
        //     option.setName('instructions_required')
        //       .setDescription('Must the recipe include instructions?')
        //       .setRequired(false)
        //   )
        //   .addBooleanOption(option => 
        //     option.setName('fill_ingredients')
        //       .setDescription('Include ingredient details?')
        //       .setRequired(false)
        //   )
        //   .addBooleanOption(option => 
        //     option.setName('add_recipe_information')
        //       .setDescription('Include additional recipe information?')
        //       .setRequired(false)
        //   )
        //   .addBooleanOption(option => 
        //     option.setName('add_recipe_instructions')
        //       .setDescription('Include step-by-step instructions?')
        //       .setRequired(false)
        //   )
        //   .addBooleanOption(option => 
        //     option.setName('add_recipe_nutrition')
        //       .setDescription('Include nutritional information?')
        //       .setRequired(false)
        //   )
        //   .addIntegerOption(option => 
        //     option.setName('max_ready_time')
        //       .setDescription('Maximum preparation time in minutes')
        //       .setRequired(false)
        //   )
        //   .addIntegerOption(option => 
        //     option.setName('min_servings')
        //       .setDescription('Minimum servings')
        //       .setRequired(false)
        //   )
        //   .addIntegerOption(option => 
        //     option.setName('max_servings')
        //       .setDescription('Maximum servings')
        //       .setRequired(false)
        //   )
        //   .addStringOption(option => 
        //     option.setName('sort')
        //       .setDescription('Sort by (e.g., calories, time)')
        //       .setRequired(false)
        
        //   )
        //   .addIntegerOption(option => 
        //     option.setName('min_calories')
        //       .setDescription('Minimum calories per serving')
        //       .setRequired(false)
        //   )
        //   .addIntegerOption(option => 
        //     option.setName('max_calories')
        //       .setDescription('Maximum calories per serving')
        //       .setRequired(false)
        //   )
        //   .addIntegerOption(option => 
        //     option.setName('min_protein')
        //       .setDescription('Minimum protein per serving (g)')
        //       .setRequired(false)
        //   )
        //   .addIntegerOption(option => 
        //     option.setName('max_protein')
        //       .setDescription('Maximum protein per serving (g)')
        //       .setRequired(false)
        //   )
        //   .addIntegerOption(option => 
        //     option.setName('min_fat')
        //       .setDescription('Minimum fat per serving (g)')
        //       .setRequired(false)
        //   )
          .addIntegerOption(option => 
            option.setName('max_fat')
              .setDescription('Maximum fat per serving (g)')
              .setRequired(false)
          ),
    

  async execute(interaction) {
      const query = interaction.options.getString('query');
      const recipes = await getRecipes(query);
  
      if (recipes && recipes.length > 0) { 
        const embed = new EmbedBuilder()
          .setColor('#ff9900')
          .setTitle(`Recipes for ${query}`)
          .setDescription(`Here are some recipes for **${query}**:`);
  
        recipes.forEach((recipe) => {
          embed.addFields({ 
            name: recipe.title, 
            value: `[View Recipe](https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id})\n[Image](${recipe.image})`
          });
        });
  
        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply(`Sorry, I couldn't find any recipes for **${query}**.`);
      }
    },
  
    listenToMessages: async (message) => {
      console.log('Received message:', message.content); // log received message
      if (message.author.bot) return;

      const recipeChannelId = foodChannelId; //  channel ID
        if (message.recipeChannelId !== recipeChannelId) return; 
  
      const query = message.content; // the message content will be the query for recipes
      const recipes = await getRecipes(query);
  
      if (recipes && recipes.length > 0) {
        const recipeList = recipes
          .map((recipe) => 
            `**${recipe.title}**\n[View Recipe](https://spoonacular.com/recipes/${recipe.id})\n![Image](${recipe.image})`
          )
          .join('\n\n');
  
        message.channel.send(`Here are some recipes for **${query}**:\n\n${recipeList}`);
      } else {
        message.channel.send(`Sorry, I couldn't find any recipes for **${query}**.`);
      }
    }
  };
  