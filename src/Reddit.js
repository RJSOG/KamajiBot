const axios = require('axios');

class Reddit {
    constructor(){
        if(Reddit._instance){
            return Reddit._instance;
        }
        Reddit._instance = this;
        return Reddit._instance;
    }

    handleRedditCommand = (msg, args, Discord) => {
        if(args.length == 0) {
            msg.reply('You need to provide args');
            return;
        }
        switch(args[0]){
            case 'get':
                if(args[1] == 'help'){
                    msg.reply(this.help('get'));
                    break;
                } 
                if(args.length == 5){
                    msg.reply('Got Ya!')
                    this.getReddit(args[1], args[2], args[3], args[4]).then((posts) => {
                        this.prettyPrint(msg, posts, Discord)
                    })
                    break;
                }
                else {
                    msg.reply('Not enough args ! Type reddit get help !');
                }
                break;
            case 'help':
                msg.reply(this.help('default'));
                break;
            default:
                msg.reply('Unknown Reddit Command !');
                break;
        }
        return;
    }

    prettyPrint = (msg, posts, Discord) => {
        let allEmbedsMsg = [];
        posts.forEach(elem => {
            const msgEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(elem.title)
            .setURL(elem.url)
            .setAuthor(elem.author)
            .addField('Score', String(elem.score), true);
            allEmbedsMsg.push(msgEmbed);
            // msg.channel.send({embeds: [msgEmbed]});
        });
        msg.channel.send({embeds: allEmbedsMsg});
    }

    getReddit = async (subreddit, listing, limit, timeframe) => {
        limit = limit-1
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
            let post = {'title': postData.title, 'url': postData.url, 'score': postData.score, 'author': postData.author_fullname}
            allPosts.push(post)
        }
        return allPosts;
    }

    help = (command) => {
        const help = {
            'default': '!reddit [get|help] args...',
            'get': '!reddit get *subreddit* *listing* *limit* *timeframe*'
        }
        return help[command];
    }
}

module.exports.Reddit = Reddit;