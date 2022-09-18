const VALIDATION_RULE = {
    colorRegex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    nudgeBlocks: ['required', 'array', {'in': ['commit', 'message']}]
}

const DEFAULT = {
    successColor: '#228c22',
    failureColor: '#990f02',
    nudgeBlocks: 'commit,message'
}

function validateInputArgs(inputArgs){
    // let webhooksValidationParam = validateWebhooks(inputArgs);
    let successColorValidationError = validateSuccessColor(inputArgs);
    let failureColorValidationParam = validateFailureColor(inputArgs);
    // let nudgeBlocksValidationParam = validateNudgeBlocks(inputArgs);

    let errors = [];
    // if(webhooksValidationParam.error !== null){
    //     errors.push(webhooksValidationParam.error);
    // }
    if(!successColorValidationError){
        errors.push(successColorValidationError);
    }
    if(!failureColorValidationParam){
        errors.push(failureColorValidationParam.error);
    }
    // if(nudgeBlocksValidationParam.error !== null){
    //     errors.push(nudgeBlocksValidationParam.error);
    // }

    return errors;
}

// function validateWebhooks(inputArgs){
//     console.log(JSON.stringify(inputArgs));
//     let webhooks = [...new Set((inputArgs.webhooks || '').toString().split(','))]; 
//     console.log(JSON.stringify(webhooks));
//     let data = {
//         webhooks: [...new Set((inputArgs.webhooks || '').toString().split(','))]
//     };
//     let rule = {
//         webhooks: VALIDATION_RULE.webhooks
//     };
//     let validation = new Validator(data, rule);
//     console.log(`Webhooks is invalid: ${validation.fails()}`);
//     let result = {
//         error: (validation.fails() ? '[webhooks] is invalid' : null)
//     };
//     return result;
// }

function validateSuccessColor(inputArgs){
    let successColor = (inputArgs.successColor || DEFAULT.successColor).toString();
    let valid = VALIDATION_RULE.colorRegex.test(successColor);
    let error = (valid ? null : '[success-color] is invalid');
    return error;
}

function validateFailureColor(inputArgs){
    let failureColor = (inputArgs.failureColor || DEFAULT.failureColor).toString();
    let valid = VALIDATION_RULE.colorRegex.test(failureColor);
    let error = (valid ? null : '[failure-color] is invalid');
    return error;
}

// function validateNudgeBlocks(inputArgs){
//     let nudgeBlocks = [...new Set((inputArgs.nudgeBlocks || DEFAULT.nudgeBlocks).toString().split(','))];
//     return new ValidatedConfigParam(nudgeBlocks, VALIDATION_RULE.nudgeBlocks, '[nudge-blocks] is invalid');
// }

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