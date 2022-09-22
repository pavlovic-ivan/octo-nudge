const util = require('../util');

function create(inputArgs, context){
  let message = buildDefaultMessage(inputArgs, context);
  message = addAdditionalInfo(inputArgs, context, message);
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
    let nudgeBLocks = util.getArrayFromString(inputArgs.nudgeBLocks);
    for(var i = 0; i < nudgeBLocks.length; i++){
      if(nudgeBLocks[i] === 'commit'){
        message.attachments[0].fields.push({
          title: 'Commit',
          value: `<${util.getCommitInfo(context)}|${getCommitSlug(context)}>`
        });
      } else if(nudgeBLocks[i] === 'message'){
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