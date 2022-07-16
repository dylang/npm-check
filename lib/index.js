'use strict';

const npmCheck = require('./in');
const createState = require('./state/state');

async function init(userOptions) {
    return npmCheck(await createState(userOptions));
}

module.exports = init;
