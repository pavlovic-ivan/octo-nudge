const core = require('@actions/core');
const github = require('@actions/github');
const util = require('./util');
const client = require('./client');

async function run() {
  try {
    let inputArgs = {
      webhooks: core.getInput('webhooks'),
      successColor: core.getInput('success-color'),
      failureColor: core.getInput('failure-color'),
      nudgeBlocks: core.getInput('nudge-blocks')
    };

    // let context = {
    //   conclussion: github.context.payload.workflow_run.conclusion,
    //   commit: github.context.payload.workflow_run.head_commit,
    //   workflowUrl: github.context.payload.workflow_run.html_url
    // };
    
    const { data, valid } = util.validateInputArgs(inputArgs);
    if(valid){
      data.webhooks.forEach(webhook => client.nudge(webhook, data.message));
    } else {

      core.error('Provided action configuration is invalid. Please check docs for configuring the action');
      process.exit(1);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
