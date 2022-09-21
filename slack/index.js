const util = require('../util');

function create(inputArgs, context){
  console.log('creating Slack message');
  let message = buildDefaultMessage(inputArgs, context);
  console.log('default message created');
  message = addAdditionalInfo(inputArgs, context, message);
  console.log('additional info added');
  console.log(`entire message: ${JSON.stringify(message)}`);
  return message;
}

function buildDefaultMessage(inputArgs, context){
    return {
        attachments: [{
          author_name: 'Octo Nudge',
          color: util.resolveColor(inputArgs, context),
          fields: []
        }]
    };
}

function addAdditionalInfo(inputArgs, context, message){
    let nudgeBLocks = util.getNudgeBlocksArray(inputArgs);
    for(var i = 0; i < nudgeBLocks.length; i++){
      if(nudgeBLocks.blocks[i] === 'commit'){
        message.attachments[0].fields.push({
          title: 'Commit',
          value: `<${util.getCommitInfo(context)}|${getCommitSlug(context)}>`
        });
      } else if(nudgeBLocks.blocks[i] === 'message'){
        message.attachments[0].fields.push({
          title: 'Message',
          value: `Workflow ${context.workflowName} conclussion: ${context.conclusion}. Workflow URL: ${context.workflowUrl}`
        });
      }
    }
    return message;
}

function getCommitSlug(context){
    return context.commit.substring(0, 6);
}

module.exports = {
  create
}