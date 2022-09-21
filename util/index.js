const VALIDATION_RULE = {
    colorRegex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    nudgeBlocks: [ 'commit', 'message' ]
}

const DEFAULT = {
    successColor: '#228c22',
    failureColor: '#990f02'
}

function validateInputArgs(inputArgs){
    let webhooksValidationError = validateWebhooks(inputArgs);
    let successColorValidationError = validateSuccessColor(inputArgs);
    let failureColorValidationError = validateFailureColor(inputArgs);
    let nudgeBlocksValidationError = validateNudgeBlocks(inputArgs);

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
    if(nudgeBlocksValidationError){
        errors.push(nudgeBlocksValidationError);
    }

    return errors;
}

function validateWebhooks(inputArgs){
    let error = null;
    if(!inputArgs.webhooks){
        error = '[webhooks] is invalid';
    } else {
        let webhooks = [... new Set(inputArgs.webhooks.toString().split(','))]
        let errors = [];
        webhooks.forEach(webhook => {
                try {
                    new URL(webhook);
                } catch(e) {
                    errors.push(`${webhook} is an invalid URL`);
                }
            }
        );
        if(errors.length > 0){
            error = errors.join(',');
        }
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

function validateNudgeBlocks(inputArgs){
    let error = null;
    if(!inputArgs.nudgeBlocks){
        error = '[nudge-blocks] is invalid';
    } else {
        let nudgeBlocks = getNudgeBlocksArray(inputArgs);
        let errors = [];
        nudgeBlocks.forEach(nudgeBlock => {
            if(!VALIDATION_RULE.nudgeBlocks.includes(nudgeBlock)){
                errors.push(`${nudgeBlock} is an invalid nudge block value`);
            }
        });
        if(errors.length > 0){
            error = errors.join(',');
        }
    }
    return error;
}

function resolveColor(inputArgs, context){
    if(context.conclussion === 'success'){
        return inputArgs.successColor;
    } else if (context.conclussion === 'failure'){
        return inputArgs.failureColor;
    }
}

function getNudgeBlocksArray(inputArgs){
    return [... new Set(inputArgs.nudgeBlocks.toString().split(','))];
}

function getCommitInfo(context){
    return `https://github.com/${context.repoName}/commit/${context.commit}`;
}

module.exports = {
    validateInputArgs,
    resolveColor,
    getNudgeBlocksArray,
    getCommitInfo
}