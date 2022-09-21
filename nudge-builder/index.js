const slackMessageBuilder = require('../slack');
const discordMessageBuilder = require('../discord');

const DOMAIN = {
    slack: 'https://hooks.slack.com',
    discord: 'https://discordapp.com'
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
    let payload = detectPlatform(webhook).create(inputArgs, context);
    return { webhook, payload };
}

function detectPlatform(webhook){
    if(webhook){
        if(webhook.startsWith(DOMAIN.slack)){
            return slackMessageBuilder;
        } else if(webhook.startsWith(DOMAIN.discord)){
          return discordMessageBuilder;
        } else {
            //throw an error, shut down the app maybe? TODO
        }
    }
}

module.exports = {
    buildMessages
}