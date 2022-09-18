const core = require('@actions/core');
const github = require('@actions/github');
const util = require('./util');
const nudgeBuilder = require('./nudge-builder');
let Validator = require('validatorjs');

async function run() {
  try {
    let inputArgs = {
      webhooks: core.getInput('webhooks'),
      successColor: core.getInput('success-color'),
      failureColor: core.getInput('failure-color'),
      nudgeBlocks: core.getInput('nudge-blocks')
    };

    let context = {
      conclussion: github.context.payload.workflow_run.conclusion,
      commit: github.context.payload.workflow_run.head_commit,
      workflowUrl: github.context.payload.workflow_run.html_url
    };


    let data = {
      successColor: (inputArgs.successColor || '#228c22').toString()
    };
    let rule = {
        successColor: ['required', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/']
    };

    console.log(JSON.stringify(data));
    console.log(JSON.stringify(rule));

    let validation = new Validator(data, rule);
    
    console.log(validation.fails());
    let error = (validation.fails() ? '[success-color] is invalid' : null);
    console.log(error);


    
    let errors = util.validateInputArgs(inputArgs);
    if(errors !== null && errors.length > 0){
      errors.forEach(error => core.error(error));
      core.error('Provided action configuration is invalid. Please check docs for configuring the action');
      process.exit(1);
    } else {
      let nudges = nudgeBuilder.buildMessages(inputArgs, context);
      nudges.forEach(message => message.send());
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
