const { Command, err } = require('@sapphire/framework');



class Base64Command extends Command{
    constructor(context, options) {
        super(context, {
          ...options,
          name: 'base64',
          description: 'Encode and decode base64',
          flags : ['decode', 'encode']
        });
    }

    messageRun = async (message, args) => {
        this.args = args;
        this.message = message;
        this.handleFlags();
    }

    handleFlags = () => {
        if(this.args.getFlags('decode')){  
            this.getData('decode').then(data => {
                if(data) this.decodeb64(data);
            })
        }
        else if(this.args.getFlags('encode')){
            this.getData('encode').then(data => {
                if(data) this.encodeb64(data);
            })
        }
        else{
            this.message.reply('No flags provided.')
        }
        return;
    }

    getData = async (action) => {
        try {
            let data = await this.args.pick('string');
            return data;
        } catch (error) {
            if(error.identifier == 'argsMissing'){
                this.message.reply("No data to " + action);
                return;
            }
        }
    }

    decodeb64 = (data) => {
        let buff = new Buffer.from(data, 'base64');
        let text = buff.toString('ascii');
        this.message.reply(`${data} decoded to ascii is ${text}`);
        return;
    }

    encodeb64 = (data) => {
        let buff = new Buffer.from(data);
        let base64data = buff.toString('base64');
        this.message.reply(`${data} in base64 is ${base64data}`)
        return;
    }
}

module.exports = {Base64Command}