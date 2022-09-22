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
      conclusions: core.getInput('conclusions'),
      events: core.getInput('events')
    };

    let context = {
      conclusion: github.context.payload.workflow_run.conclusion,
      commit: github.context.payload.workflow_run.head_commit.id,
      workflowUrl: github.context.payload.workflow_run.html_url,
      workflowName: github.context.payload.workflow_run.name,
      repoName: github.context.payload.repository.full_name,
      event: github.context.payload.workflow_run.event
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
              core.debug(`Message sent successfully. Http status: ${res.status}`); 
            })
            .catch(error => { 
              core.error(error.message); 
            })
          }
        );
      } else {
        core.info('No messages will be sent. Workflow run does not apply to the config given');
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

function toNudge(inputArgs, context){
  let conclusions = util.getArrayFromString(inputArgs.conclusions);
  let events = util.getArrayFromString(inputArgs.events);
  return conclusions.includes(context.conclusion) && events.includes(context.event);
}

function nudge(message){
  let payload = JSON.stringify(message.payload);
  return axios.post(message.webhook, JSON.parse(payload));
}

run();
