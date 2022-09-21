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
    console.log(`Debug: ${JSON.stringify(webhook)}, ${JSON.stringify(inputArgs)}, ${JSON.stringify(context)}`);
    console.log(`Debug slackMessageBuilder: ${JSON.stringify(slackMessageBuilder)}`);
    console.log(`Debug discordMessageBuilder: ${JSON.stringify(discordMessageBuilder)}`);
    let payload = detectPlatform(webhook, inputArgs, context);
    console.log(`Debug payload: ${JSON.stringify(payload)}`);
    return { webhook, payload };
}

function detectPlatform(webhook, inputArgs, context){
    if(webhook){
        if(webhook.startsWith(DOMAIN.slack)){
            return slackMessageBuilder.create(inputArgs, context);
        } else if(webhook.startsWith(DOMAIN.discord)){
          return discordMessageBuilder.create(inputArgs, context);
        } else {
            //throw an error, shut down the app maybe? TODO
        }
    }
}

module.exports = {
    buildMessages
}