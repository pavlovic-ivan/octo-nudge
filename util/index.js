let Validator = require('validatorjs');

class ValidatedConfigParam {
    constructor(data, validationRules, error){
        let validation = new Validator({ data }, { data: validationRules});
        this.error = (validation.fails() ? error : null);
    }
}

const VALIDATION_RULE = {
    webhooks: 'required|array|min:1',
    successColor: ['required', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
    failureColor: ['required', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
    nudgeBlocks: ['required', 'array', {'in': ['commit', 'message']}]
}

const DEFAULT = {
    successColor: '#228c22',
    failureColor: '#990f02',
    nudgeBlocks: 'commit,message'
}

function validateInputArgs(inputArgs){
    let webhooksValidationParam = validateWebhooks(inputArgs);
    let successColorValidationParam = validateSuccessColor(inputArgs);
    let failureColorValidationParam = validateFailureColor(inputArgs);
    let nudgeBlocksValidationParam = validateNudgeBlocks(inputArgs);

    let errors = [];
    if(webhooksValidationParam.error !== null){
        errors.push(webhooksValidationParam.error);
    }
    if(successColorValidationParam.error !== null){
        errors.push(successColorValidationParam.error);
    }
    if(failureColorValidationParam.error !== null){
        errors.push(failureColorValidationParam.error);
    }
    if(nudgeBlocksValidationParam.error !== null){
        errors.push(nudgeBlocksValidationParam.error);
    }

    return errors;
}

function validateWebhooks(inputArgs){
    let webhooks = (inputArgs.webhooks || '').toString();
    return new ValidatedConfigParam([...new Set(webhooks.split(','))], VALIDATION_RULE.webhooks, '[webhooks] is invalid');
}

function validateSuccessColor(inputArgs){
    return new ValidatedConfigParam((inputArgs.successColor || DEFAULT.successColor), VALIDATION_RULE.successColor, '[success-color] is invalid');
}

function validateFailureColor(inputArgs){
    return new ValidatedConfigParam((inputArgs.failureColor || DEFAULT.failureColor), VALIDATION_RULE.failureColor, '[failure-color] is invalid');
}

function validateNudgeBlocks(inputArgs){
    let nudgeBlocks = [...new Set((inputArgs.nudgeBlocks || DEFAULT.nudgeBlocks).toString().split(','))];
    return new ValidatedConfigParam(nudgeBlocks, VALIDATION_RULE.nudgeBlocks, '[nudge-blocks] is invalid');
}

// function createMessage(data){
//     return {
//         attachments: [{
//           author_name: 'Octo Nudge',
//           color: data.successColor,
//           fields: []
//         }]
//     };
// }

// function convertHexToInt(hex){
//     hex = hex.replace('#', '');
//     return parseInt(hex, 16);
// }

// function addAdditionalInfo(repoConfig, message, workflow_run, repository){
//     for(var i = 0; i < repoConfig.blocks.length; i++){
//       if(repoConfig.blocks[i] === 'commit'){
//         message.embeds[0].fields.push({
//           name: 'Commit',
//           value: `${util.getCommitInfo(workflow_run, repository)}`
//         });
//       } else if(repoConfig.blocks[i] === 'message'){
//         message.embeds[0].fields.push({
//           name: 'Message',
//           value: `Workflow ${workflow_run.name} conclussion: ${workflow_run.conclusion}. Workflow URL: ${workflow_run.html_url}`
//         });
//       }
//     }
//     return message;
// }

module.exports = {
    validateInputArgs
}