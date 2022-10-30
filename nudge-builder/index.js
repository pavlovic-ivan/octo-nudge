const slackMessageBuilder = require('../slack');
const discordMessageBuilder = require('../discord');

const DOMAIN = {
    slack: 'https://hooks.slack.com',
    discord: ['https://discord.com', 'https://discord.com']
}

function buildMessages(inputArgs, context){
    let messages = [];
    inputArgs.webhooks
        .toString()
        .split(',')
        .forEach(webhook => messages.push(buildMessage(webhook, inputArgs, context)));
    return messages;
}

function buildMessage(webhook, inputArgs, context){
    let payload = createPlatformSpecificMessage(webhook, inputArgs, context);
    return { webhook, payload };
}

function createPlatformSpecificMessage(webhook, inputArgs, context){
    if(webhook){
        if(webhook.startsWith(DOMAIN.slack)){
            return slackMessageBuilder.create(inputArgs, context);
        } else if(webhook.startsWith(DOMAIN.discord[0]) || webhook.startsWith(DOMAIN.discord[1])){
          return discordMessageBuilder.create(inputArgs, context);
        } else {
            throw new Error(`Domain of your webhook is not supported`);
        }
    }
}

module.exports = {
    buildMessages
}