'use strict';

const checkUnused = require('./check-unused');
const processData = require('./process-data');
const state = require('./util/state');

function npmCheck(userOptions) {
    const currentState = state(userOptions);

    return Promise.resolve(currentState)
        .then(checkUnused)
        .then(processData);
}

module.exports = npmCheck;
