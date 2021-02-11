'use strict';

const npmCheck = require('./in');
const createState = require('./state/state');

async function init(userOptions) {
    const currentState = await createState(userOptions);
    return npmCheck(currentState);
}

module.exports = init;
