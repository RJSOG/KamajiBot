const { Command } = require('@sapphire/framework');

class PingCommand extends Command{
    constructor(context, options) {
        super(context, {
          ...options,
          name: 'ping',
          description: 'Ping Pong Command.'
        });
        this.availableCommands = ['ping'];
    }

    messageRun = async (message, args) => {
        this.args = args;
        this.message = message;
        this.message.reply('Pong !');
    }

}

module.exports = {PingCommand}