const util = require('../util');

class DiscordMessageBuilder {
  constructor(webhook){
    this.webhook = webhook;
  }

    create(inputArgs, context){
        let message = buildDefaultMessage(inputArgs, context);
        message = addAdditionalInfo(inputArgs, context, message);
        return message;
    }
}

function buildDefaultMessage(inputArgs, context){
    return {
        tts: false,
        embeds: [
        {
            color: convertHexToInt(util.resolveColor(inputArgs, context)),
            fields: []
        }
        ]
    }
}

function convertHexToInt(hex){
    hex = hex.replace('#', '');
    return parseInt(hex, 16);
}

function addAdditionalInfo(inputArgs, context, message){
  let nudgeBlocks = util.getNudgeBlocksArray(inputArgs);
    for(var i = 0; i < nudgeBlocks.length; i++){
      if(nudgeBlocks.blocks[i] === 'commit'){
        message.embeds[0].fields.push({
          name: 'Commit',
          value: `${util.getCommitInfo(context)}`
        });
      } else if(nudgeBlocks.blocks[i] === 'message'){
        message.embeds[0].fields.push({
          name: 'Message',
          value: `Workflow ${context.workflowName} conclussion: ${context.conclusion}. Workflow URL: ${context.workflowUrl}`
        });
      }
    }
    return message;
}

module.exports.DiscordMessageBuilder = new DiscordMessageBuilder();