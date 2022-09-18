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
    let webhooksValidationError = validateWebhooks(inputArgs);
    let successColorValidationError = validateSuccessColor(inputArgs);
    let failureColorValidationError = validateFailureColor(inputArgs);
    // let nudgeBlocksValidationParam = validateNudgeBlocks(inputArgs);

    let errors = [];
    if(webhooksValidationError !== null){
        errors.push(webhooksValidationError);
    }
    if(successColorValidationError){
        errors.push(successColorValidationError);
    }
    if(failureColorValidationError){
        errors.push(failureColorValidationError);
    }
    // if(nudgeBlocksValidationParam.error !== null){
    //     errors.push(nudgeBlocksValidationParam.error);
    // }

    return errors;
}

function validateWebhooks(inputArgs){
    let error = null;
    if(!inputArgs.webhooks){
        error = '[webhooks] is invalid';
    } else {
        inputArgs.webhooks
            .toString()
            .split(',')
            .forEach(webhook => {
                try {
                    new URL(webhook);
                } catch(e) {
                    error = `${webhook} is an invalid URL`;
                }
            }
        );
    }
    return error;
}

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