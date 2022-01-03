const axios = require('axios');

class Reddit {
    constructor(){
        if(Reddit._instance){
            return Reddit._instance;
        }
        Reddit._instance = this;
        return Reddit._instance;
    }

    handleRedditCommand = (msg, args) => {
        if(args.length == 0) msg.reply('You need to provide args');
        switch(args[0]){
            case 'get':
                if(args.length == 5) this.getReddit(args[1], args[2], args[3], args[4]);
                else msg.reply('Not enough args !');
                break
            default:
                msg.reply('Unknown Reddit Command !');
                break;
        }
    }

    getReddit = async (subreddit, listing, limit, timeframe) => {
        const redditUrl = `https://www.reddit.com/r/${subreddit}/${listing}.json?limit=${limit}&t=${timeframe}`;
        let resp = await axios.get(redditUrl);
        const data = resp.data;
        console.log(resp.data)
    }   
}

module.exports.Reddit = Reddit;