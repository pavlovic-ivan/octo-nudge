// webhooks: core.getInput('webhooks', { required: true }),
// successColor: core.getInput('success-color'),
// failureColor: core.getInput('failure-color'),
// nudgeBlocks: core.getInput('nudge-blocks')
const { SlackMessageBuilder } = require('../slack');
const { DiscordMessageBuilder } = require('../discord');

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
            return new SlackMessageBuilder(webhook);
        } else if(webhook.startsWith(DOMAIN.discord)){
          return new DiscordMessageBuilder(webhook);
        } else {
            //throw an error, shut down the app maybe? TODO
        }
    }
}

module.exports = {
    buildMessages
}