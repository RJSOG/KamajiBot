require('dotenv').config();
const Discord = require('discord.js');
const Reddit =  require('./Reddit.js').Reddit;
   
const intents = {
    intents: ['GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES']
}
const client = new Discord.Client(intents);
const prefix = "!";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (msg) => {
    if(msg.author.bot) return;
    if(!msg.content.startsWith(prefix)) return;

    const commandBody = msg.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    handleMessage(msg, args, command);
});

let handleMessage = (msg, args, command) => {
    switch(command){
        case 'ping':
            msg.reply("Pong !");
            break;

        case 'reddit':
            const RedditObj = new Reddit();
            RedditObj.handleRedditCommand(msg, args);
            break;

        default:
            console.log("Unknown Command !");
            break;
    }
}


client.login(process.env.CLIENT_TOKEN);
