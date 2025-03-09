
const { SlashCommandBuilder } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('sayings')
        .setDescription('Get a random joke, fact or quote'),
    async execute(interaction) {
        // Defining  different categories
        const jokes = [
            "Why don’t skeletons fight each other? They don’t have the guts.",
            "I told my wife she was drawing her eyebrows too high. She looked surprised.",
            "I’m reading a book on anti-gravity. It’s impossible to put down.",
            // Friends Jokes
            "Chandler: 'Could I BE any more...?'",
            "Joey: 'How you doin'?'",
            "Phoebe: 'Smelly Cat, Smelly Cat, what are they feeding you?'",
            "Ross: 'We were on a break!'",
            "Monica: 'Seven! Seven! Seven!'",
        ];

        const facts = [
            'Honey never spoils.',
            'Bananas are berries, but strawberries are not.',
            'Octopuses have three hearts.',
            'A group of flamingos is called a "flamboyance."',
            'A day on Venus is longer than a year on Venus.'
        ];

        const quotes = [
            // Naruto Quotes
            '“I’m not gonna run away, I never go back on my word! That’s my nindo: my ninja way!” - Naruto Uzumaki',
            '“The next generation will always surpass the previous one. It’s one of the never-ending cycles in life.” - Kakashi Hatake',
            '“A lesson without pain is meaningless. That’s because no one can gain without sacrificing something. But by enduring that pain and overcoming it, he shall obtain a powerful, unmatched heart.” - Edward Elric (Fullmetal Alchemist)',
            '“When you give up, that’s when the game is over.” - Naruto Uzumaki',
            '“Power comes in response to a need, not a desire. You have to create that need.” - Goku (Dragon Ball Z)',
            
            // Itachi Uchiha Quotes
            '“People’s lives don’t end when they die, it ends when they lose faith. It’s not the face of the person that matters, but what they did while they lived.” - Itachi Uchiha',
            '“The ones who are crazy enough to think they can change the world are the ones who do.” - Itachi Uchiha',
            '“I have always loved you, my little brother. No matter what, I will always be your older brother.” - Itachi Uchiha',

            // Obito Uchiha Quotes
            '“The world isn’t perfect, but it’s there for us, trying the best it can... that’s what makes it so damn beautiful.” - Obito Uchiha',
            '“I live in a world of illusions. That’s the way it’s always been. But after meeting you... I realized there was another world outside of my own illusions.” - Obito Uchiha',

            // Pain Quotes
            '“Know pain, feel pain, accept pain. The only thing that can heal the pain is a little bit of pain.” - Pain (Nagato)',
            '“Knowing what it feels like to be in pain is exactly why we try to be kind to others, because we understand that the pain of others is far more immense.” - Pain (Nagato)',
            '“True pain is not physical. It’s mental. The soul has the capacity to break even the strongest of bodies.” - Pain',
            '“To be able to understand the pain of others is the key to obtaining true strength. We are all victims of this world.” - Pain',
            
            // Madara Uchiha Quotes
            '“Wake up to reality. Nothing ever goes as planned in this accursed world. The longer you live, the more you realize that in this reality, only pain, suffering, and futility exist.” - Madara Uchiha',
            '“When a man learns to love, he must bear the risk of hatred. And even though the man becomes weaker, love gives him strength to endure it. That is the true meaning of strength.” - Madara Uchiha',
            '“It’s human nature not to realize the true value of something, unless they lose it. People only realize after losing something how precious it was to them. They will never know what they’ve lost, until it’s too late.” - Madara Uchiha',
            '“The Uchiha are destined to rule the world! You will all kneel before the power of my will!” - Madara Uchiha',
            '“When a man learns to love, he must bear the risk of hatred. And even though the man becomes weaker, love gives him strength to endure it. This is the only way to protect the things that matter.” - Madara Uchiha',
            '“I will not let my dreams die. I will bring it all to fruition with my own power!” - Madara Uchiha',

            // Jiraiya Quotes
            '“A lesson without pain is meaningless. That’s because no one can gain without sacrificing something. But by enduring that pain and overcoming it, he shall obtain a powerful, unmatched heart.” - Jiraiya',
            '“When you give up, that’s when the game is over. Keep fighting, and you’ll never know what you can achieve.” - Jiraiya',
            '“The future belongs to those who believe in the beauty of their dreams. The battle ahead is one of passion. And the greatest challenge is overcoming your own self-doubt.” - Jiraiya',

            // Attack on Titan Quotes
            '“If you win, you live. If you lose, you die. If you don’t fight, you can’t win.” - Eren Yeager',
            '“We’re all human. We all have things that we want to protect, even if we’re fighting for different reasons.” - Mikasa Ackerman',
            '“In the end, we only regret the chances we didn’t take.” - Armin Arlert',
            '“No matter how bleak the future seems, we can still keep fighting!” - Levi Ackerman',
            '“The world is a cruel place, but it’s also very beautiful.” - Erwin Smith',
            
            // Famous Quotes
            '“May the Force be with you.” - Star Wars',
            '“There’s no place like home.” - The Wizard of Oz',
            '“I’ll be back.” - The Terminator',
            '“Life is like a box of chocolates. You never know what you’re gonna get.” - Forrest Gump',
            '“Just keep swimming.” - Finding Nemo',
            '“How you doin’?” - Friends (Joey Tribbiani)',
            '“To infinity and beyond!” - Toy Story (Buzz Lightyear)',
            '“I am the one who knocks!” - Breaking Bad (Walter White)',
            '“Winter is coming.” - Game of Thrones',
            '“Live long and prosper.” - Star Trek',
            '“The only thing we have to fear is fear itself.” - Franklin D. Roosevelt',
            '“In the end, we will remember not the words of our enemies, but the silence of our friends.” - Martin Luther King Jr.',
            '“The greatest glory in living lies not in never falling, but in rising every time we fall.” - Nelson Mandela',
            '“Do not go where the path may lead, go instead where there is no path and leave a trail.” - Ralph Waldo Emerson',
            '“Be yourself; everyone else is already taken.” - Oscar Wilde'
        ];

        // Randomly picks one of the categories (jokes, facts, or quotes)
        const category = Math.floor(Math.random() * 3);
        
        let randomResponse;

        if (category === 0) {
            randomResponse = jokes[Math.floor(Math.random() * jokes.length)];
        } else if (category === 1) {
            randomResponse = facts[Math.floor(Math.random() * facts.length)];
        } else {
            randomResponse = quotes[Math.floor(Math.random() * quotes.length)];
        }

        await interaction.reply(randomResponse);
    }
};
