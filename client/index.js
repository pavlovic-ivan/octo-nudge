const { default: axios } = require('axios');

function nudge(url, message){
    message = JSON.stringify(message);
    return axios.post(url, JSON.parse(message));
}

module.exports = {
    nudge
}