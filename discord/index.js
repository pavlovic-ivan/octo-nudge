const util = require('../util');

function create(inputArgs, context){
  let message = buildDefaultMessage(inputArgs, context);
  message = addAdditionalInfo(inputArgs, context, message);
  return message;
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
  let nudgeBlocks = util.getArrayFromString(inputArgs.nudgeBlocks);
    for(var i = 0; i < nudgeBlocks.length; i++){
      if(nudgeBlocks[i] === 'commit'){
        message.embeds[0].fields.push({
          name: 'Commit',
          value: `${util.getCommitInfo(context)}`
        });
      } else if(nudgeBlocks[i] === 'message'){
        message.embeds[0].fields.push({
          name: 'Message',
          value: `Workflow ${context.workflowName} conclusion: ${context.conclusion}. Workflow URL: ${context.workflowUrl}`
        });
      }
    }
    return message;
}

module.exports = {
  create
}