const core = require('@actions/core');
const github = require('@actions/github');
const util = require('./util');
const nudgeBuilder = require('./nudge-builder');
const { default: axios } = require('axios');

async function run() {
  try {
    let inputArgs = {
      webhooks: core.getInput('webhooks', { required: true }),
      successColor: core.getInput('success-color'),
      failureColor: core.getInput('failure-color'),
      nudgeBlocks: core.getInput('nudge-blocks'),
      conclussions: core.getInput('conclussions')
    };

    let context = {
      conclussion: github.context.payload.workflow_run.conclusion,
      commit: github.context.payload.workflow_run.head_commit.id,
      workflowUrl: github.context.payload.workflow_run.html_url,
      workflowName: github.context.payload.workflow_run.name,
      repoName: github.context.payload.repository.full_name
    };
    
    let errors = util.validateInputArgs(inputArgs);
    if(errors !== null && errors.length > 0){
      errors.forEach(error => core.error(error));
      core.error('Provided action configuration is invalid. Please check docs for configuring the action');
      process.exit(1);
    } else {
      if(toNudge(inputArgs, context)){
        let nudges = nudgeBuilder.buildMessages(inputArgs, context);
        nudges.forEach(message => {
          nudge(message)
            .then(res => { 
              core.info(`Message sent successfully. Http status: ${res.status}`); 
            })
            .catch(error => { 
              core.error(error.message); 
            })
          }
        );
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

function toNudge(inputArgs, context){
  let conclussions = util.getArrayFromString(inputArgs.conclussions);
  return conclussions.includes(context.conclussion);
}

function nudge(message){
  let payload = JSON.stringify(message.payload);
  return axios.post(message.webhook, JSON.parse(payload));
}

run();
