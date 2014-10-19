'use strict';

var checkUnused = require('./check-unused');
var processData = require('./process-data');
var mergeData = require('./merge-data');
var q = require('q');

function npmCheck(options) {

    if (options.global) {
        console.log('global');
        options.path = '/usr/local/lib/';
    }

    return q.all([
        checkUnused(options),
        processData(options)
    ])
    .spread(mergeData);
}

module.exports = npmCheck;