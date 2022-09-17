// let Validator = require('validatorjs');

function validateInputArgs(inputArgs){
    let data = inputArgs;
    data.message = createMessage();
    let valid = true;
    return { data, valid };
}

function createMessage(inputArgs){
    return {
        tts: false,
        embeds: [
        {
            color: convertHexToInt(inputArgs.successColor),
            fields: []
        }
        ]
    }
}

function convertHexToInt(hex){
    hex = hex.replace('#', '');
    return parseInt(hex, 16);
}

module.exports = {
    validateInputArgs
}