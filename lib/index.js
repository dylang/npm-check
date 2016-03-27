'use strict';

const checkUnused = require('./check-unused');
const processData = require('./process-data');
const mergeData = require('./merge-data');
const options = require('./util/options');

function npmCheck(userOptions) {
    options.init(userOptions);

    return Promise.all([
        checkUnused(),
        processData(options.all())
    ])
    .then(mergeData);
}

module.exports = npmCheck;
