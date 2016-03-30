'use strict';

const checkUnused = require('./check-unused');
const checkNpm = require('./check-npm');
const state = require('./util/state');

function npmCheck(userOptions) {
    const currentState = state(userOptions);

    if (currentState.get('cwdPackageJson').error) {
        return Promise.reject(currentState.get('cwdPackageJson').error);
    }

    return Promise.resolve(currentState)
        .then(checkUnused)
        .then(checkNpm);
}

module.exports = npmCheck;
