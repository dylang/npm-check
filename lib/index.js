'use strict';

const npmCheck = require('./in');
const createState = require('./state/state');

function init(userOptions) {
    return createState(userOptions)
        .then(currentState => npmCheck(currentState));
}

module.exports = init;
