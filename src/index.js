const { SapphireClient } = require('@sapphire/framework');
require('dotenv').config();

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES']});
client.login(process.env.CLIENT_TOKEN);