const { SlashCommandBuilder } = require('discord.js');

const perksCategories = {
        teamPlayer: [
          "Bond", "Empathy", "Prove Thyself", "Leader", "We'll Make It", "Teamwork: Collective Stealth", "Teamwork: Power of Two",
          "Guardian", "Camaraderie", "For the People", "Friendly Competition", "Solidarity", "Reassurance", "Moment Of Glory", "Aftercare", "Any Means Necessary", "Appraisal",
            "Autodidact", "Background Player", "Better Than New", "Better Together", "Blood Pact", "Boon: Dark Theory", "Boon: Exponential", "Build to Last", "Ace in the Hole", "Boon: Circle of Healing",
            "Boon: Illumination", "Boon: Shadow Step",  "Borrowed Time", "Botany Knowledge", "Breakout", "Prove Thyself", "Desperate Measures", "Fixated", "Kindred", "Shoulder The Burden", "Streetwise",
            "Teamwork: Collective Stealth",  "Teamwork: Power of Two", "Vigil",   "Wiretap",
        ],
        theHealer: [
          "Self-Care", "Botany Knowledge", "We’ll Make It", "Reassurance", "Boon: Circle of Healing", "Soul Guard",
          "Pharmacy", "Quick Gambit", "Resilience", "Reactive Healing", "Renewal", "Adrenaline", "Autodidact", "Better Than New", "Blood Pact", "Clean Break", "Boon: Circle of Healing",
          "Deadline", "Plot Twist", "Resilience", "Desperate Measures", "Empathic Connection", "Fast Track", "For the People", "Inner Strength", "Leader", "Moment Of Glory",  "No One Left Behind", 
          "Object of Obsession",  "Resurgence", "Solidarity", "Strength in Shadows",  "Teamwork: Power of Two", "This Is Not Happening", "We're Gonna Live Forever",
        ],
        offensiveLoop: [
          "Saboteur", "Deception", "Diversion", "Bite the Bullet", "Blast Mine", "Borrowed Time", "Deliverance", "Smash Hit", "Power Struggle", 
          "Breakout", "Second Wind", "Cut Loose", "Bardic Inspiration", "Plot Twist", "Background Player", "Blood Rush", "Dead Hard", "Lithe", "Balance Landing", "Quick & Quiet", "Spine Chill", "Dance With Me", "Windows Of Opportunity", "Iron Will",
          "Up The Ante", "Streetwise", "Urban Evasion", "Strength in Shadows", "Any Means Necessary", "Champion of Light", "Chemical Trap", "Cut Loose", "Balanced Landing", "Dead Hard",   "Dance With Me",
          "Deception", "Decisive Strike", "Head On", "Finesse", "Lithe",  "Exultation", "Hope",  "Light-Footed", "Lightweight",  "Mettle Of Man",  "Parental Guidance", "Residual Manifest", "Smash Hit", "Sprint Burst",
          "Urban Evasion", "Windows Of Opportunity", 
        ],
    
        auraReading: [
          "Dark Sense", "Detective's Hunch", "Empathy", "Clairvoyance", "Open-Handed", "Bond", "Boon: Illumination", "Visionary",
          "Exultation", "Eyes Of Belmont", "Still Sight", "Alert", "Aftercare", "Blood Pact", "Breakdown", "Buckle Up", "Clairvoyance", "Counterforce", "Babysitter",  "Boon: Illumination",  "Counterforce",
          "Detective's Hunch", "Distortion", "Déjà Vu", "Empathic Connection", "Empathy", "Eyes Of Belmont",  "Fogwise", "Inner Focus", "Invocation: Treacherous Crows",  "Hardened", "Left Behind",
          "Lucky Star",  "No One Left Behind", "Object of Obsession",  "Premonition",  "Quick Gambit", "Rookie Spirit", "Scene Partner", "Spine Chill", "Wake Up!", "Wicked",
        ],
    
        injuredDownedHooked: [
          "Unbreakable", "Flip-Flop", "Resurgence", "No Mither", "Final Chapter", "Soul Guard", "Breakdown", "Moment Of Glory", "Decisive Strike",
          "This Is Not Happening", "Still Sight", "Buckle Up", "Overcome", "Boil Over", "Boon Exponential", "Buckle Up", "Breakout", "Plot Twist", "Tenacity", "Reassuarance", "Delivarance", "For the People",
          "Kindred", "Iron Will",  "Low Profile", "Lucky Break",  "Lucky Star", "Made For This",  "Mettle Of Man", "No Mither",  "No One Left Behind", "Off the Record", "Overcome",  "Poised", "Potential Energy", "Power Struggle",
          "Self Preservation", "Slippery Meat", "Up The Ante", 

        ],
        genAndItems: [
          "Deliverance", "Prove Thyself", "Hyperfocus", "Flashbang", "Plunderer's Instinct", "Fast Track", "Resilience", "Empathic Connection", "Blast Mine", "Better Together", "Clairvoyance", "Corrective Action", 
          "Bardic Inspiration", "Calm Spirit",  "Counterforce",   "Deadline", "Resilience", "Mirrored Illusion", "Prove Thyself",  "Detective's Hunch", "Dramaturgy", "Déjà Vu", "Exultation",  "Fogwise",
          "Friendly Competition", "Invocation: Weaving Spiders", "Moment Of Glory", "Overzealous", "Pharmacy",  "Quick Gambit", "Repressed Alliance",  "Wiretap",
           "Red Herring", "Rookie Spirit", "Scavenger", "Small Game", "Sole Survivor", "Specialist", "Stake Out", "Technician", "This Is Not Happening",
        ],
    }
      
      

// combines all perks into one array for "all perks" randomized option
const allPerks = [].concat(...Object.values(perksCategories));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dbd')
    .setDescription('Dead by Daylight random perk build generator')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Select a category for the perk build')
        .setRequired(true)
        .addChoices(
          { name: 'Teamplayer', value: 'teamPlayer' },
          { name: 'Healer', value: 'theHealer' },
          { name: 'Aura Reading', value: 'auraReading' },
          { name: 'Looper', value: 'offensiveLoop' },
          { name: 'Injured, Downed, Hooked', value: 'injuredDownedHooked' },
          { name: 'Gen and Items', value: 'genAndItems' },
          { name: 'All Perks', value: 'all' }
        ))
    .addStringOption(option =>
      option.setName('option')
        .setDescription('Choose between customized, randomized, or all-perks')
        .setRequired(true)
        .addChoices(
          { name: 'Customized', value: 'customized' },
          { name: 'Randomized', value: 'randomized' }
        ))
    
    .addStringOption(option =>
      option.setName('custom_perks')
        .setDescription('Enter specific perks, separated by commas (only for customized option)')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    const category = interaction.options.getString('category');
    const option = interaction.options.getString('option');
    // const customPerksInput = interaction.options.getString('custom_perks');

    // function to select 4 random perks from the chosen category or from all perks
    function getRandomPerks(perksArray) {
      let randomPerks = [];
      let copyList = [...perksArray];
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * copyList.length);
        randomPerks.push(copyList[randomIndex]);
        copyList.splice(randomIndex, 1); // removes selected perk to avoid repeats
      }
      return randomPerks;
    }
    if (option === 'randomized' && category !== 'all') {
        await interaction.reply("The 'Randomized' option is only available when selecting 'All Perks'. Please choose 'All Perks' to use this option.");
        return; 
    }

    if (option === 'customized') {
        if (!perksCategories[category]) {
            await interaction.reply("The 'Custimized' option is only available when selecting all categories except 'All Perks'. Please choose another category to use this option.");
            return;
        }
      // randomized perk build from the selected category
      const randomPerks = getRandomPerks(perksCategories[category]);
      await interaction.reply(`Here is your random ${category} perk build: \n1. **${randomPerks[0]}**\n2. **${randomPerks[1]}**\n3. **${randomPerks[2]}**\n4. **${randomPerks[3]}**`);
    } else if (option === 'randomized') {
      // randomized perk build from all available perks
      const randomPerks = getRandomPerks(allPerks);
      await interaction.reply(`Here is your random perk build from all available perks: \n1. **${randomPerks[0]}**\n2. **${randomPerks[1]}**\n3. **${randomPerks[2]}**\n4. **${randomPerks[3]}**`);
   
      }
    }
}
   