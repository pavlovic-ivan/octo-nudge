const VALIDATION_RULE = {
    colorRegex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    nudgeBlocks: [ 'commit', 'message' ],
    conclusions: [ 'failure', 'success' ],
    events: [ 'push' , 'schedule' ]
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
    let conclusionsValidationError = validateConclusions(inputArgs);
    let eventsValidationError = validateEvents(inputArgs);

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
    if(conclusionsValidationError){
        errors.push(conclusionsValidationError);
    }
    if(eventsValidationError){
        errors.push(eventsValidationError);
    }

    return errors;
}

function validateEvents(inputArgs){
    let error = null;
    if(!inputArgs.events){
        error = '[events] is invalid';
    } else {
        let events = getArrayFromString(inputArgs.events);
        let errors = [];
        events.forEach(event => {
            if(!VALIDATION_RULE.events.includes(event)){
                errors.push(`${event} is an invalid event value`);
            }
        });
        if(errors.length > 0){
            error = errors.join(',');
        }
    }
    return error;
}

function validateConclusions(inputArgs){
    let error = null;
    if(!inputArgs.conclusions){
        error = '[conclusions] is invalid';
    } else {
        let conclusions = getArrayFromString(inputArgs.conclusions);
        let errors = [];
        conclusions.forEach(conclusion => {
            if(!VALIDATION_RULE.conclusions.includes(conclusion)){
                errors.push(`${conclusion} is an invalid conclusion value`);
            }
        });
        if(errors.length > 0){
            error = errors.join(',');
        }
    }
    return error;
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
                    errors.push(`Your webhook URL is invalid`);
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
        let nudgeBlocks = getArrayFromString(inputArgs.nudgeBlocks);
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
    if(context.conclusion === 'success'){
        return inputArgs.successColor;
    } else if (context.conclusion === 'failure'){
        return inputArgs.failureColor;
    }
}

function getArrayFromString(stringArray){
    return [... new Set(stringArray.toString().split(','))];
}

function getCommitInfo(context){
    return `https://github.com/${context.repoName}/commit/${context.commit}`;
}

module.exports = {
    validateInputArgs,
    resolveColor,
    getCommitInfo,
    getArrayFromString
}