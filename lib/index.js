'use strict';

const npmCheck = require('./in');
const state = require('./state/state');

function init(userOptions) {
    const currentState = state(userOptions);
    return npmCheck(currentState);
}

module.exports = init;
