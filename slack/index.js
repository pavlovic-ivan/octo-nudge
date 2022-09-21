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
    console.log(`message is: ${JSON.stringify(message)}`);
    for(var i = 0; i < nudgeBLocks.length; i++){
      console.log(`block: ${nudgeBLocks[i]}`);
      console.log(`att: ${JSON.stringify(message.attachments[0])}`);
      console.log(`fields: ${JSON.stringify(message.attachments[0].fields)}`);

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
      console.log(`message after iteration is: ${JSON.stringify(message)}`);
    }
    return message;
}

function getCommitSlug(context){
  console.log(`commit slug: ${context.commit.substring(0, 6)}`);
    return context.commit.substring(0, 6);
}

module.exports = {
  create
}