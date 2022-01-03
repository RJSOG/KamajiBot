const { Command } = require('@sapphire/framework');
const Discord = require('discord.js');
const axios = require('axios');


class RedditCommand extends Command {
    constructor(context, options) {
        super(context, {
          ...options,
          name: 'reddit',
          description: 'Reddit Scrapper.'
        });
        this.availableCommands = ['getPost', 'getUser', 'help'];
    }

    messageRun = async (message, args) => {
        this.args = args;
        this.message = message;
        try {
            let command = await this.args.pick('string');
            if(!this.availableCommands.includes(command)){
                message.reply('Unknown Reddit Command !')
            }else{
                this.handleArgs(command);
            }
        } catch (error) {
            if(error.identifier == 'argsMissing'){
                message.reply("No command provided.")
            }
        }
        return;
    }

    handleArgs = async (command) => {
        try{
            let args = await this.args.rest('string');
            args = args.split(" ");
            if(args[0] == 'help'){
                this.message.reply(this.help(command));
                return;
            };
            switch(command){
                case 'getPost':
                    if(args.length == 4){
                        this.getRedditPost(args[0], args[1], args[2], args[3]).then((posts) => {
                            this.prettyPrintPost(posts);
                        })
                    }else{
                        this.message.reply('Wrong numbers of args ! Type reddit getPost help');
                    }
                    break;

                case 'getUser':
                    break;
                
                case 'help':
                    this.message.reply(this.help('default'));
                    break;
            }
            return;
        } catch (error){
            if(error.identifier == 'argsMissing'){
                this.message.reply("No args provided.");
            }
            return;
        }
    }

    prettyPrintPost = (posts) => {
        let allEmbedsmessage = [];
        posts.forEach(elem => {
            const messageEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(elem.title)
            .setURL(elem.url)
            .setAuthor(elem.author)
            .addField('Score', String(elem.score), true);
            allEmbedsmessage.push(messageEmbed);
        });
        this.message.channel.send({embeds: allEmbedsmessage});
    }

    getRedditPost = async (subreddit, listing, limit, timeframe) => {
        const redditUrl = `https://www.reddit.com/r/${subreddit}/${listing}.json?limit=${limit}&t=${timeframe}`;
        let resp = await axios.get(redditUrl);
        const post = resp.data.data;
        let allPost = this.parseReddit(post);
        return allPost;
    }

    parseReddit(data){
        let allPosts = []
        for(let id in data.children){
            let postData = data.children[id].data;
            let post = {'title': postData.title, 'url': postData.url, 'score': postData.score, 'author': postData.author}
            allPosts.push(post)
        }
        return allPosts;
    }

    help = (command) => {
        const help = {
            'default': '!reddit [getPost|getUser|help] args...',
            'getPost': '!reddit getPost *subreddit* *listing* *limit* *timeframe*',
            'getUser': '!reddit getUser *username*'
        }
        return help[command];
    }
}

module.exports = {RedditCommand}