'use strict';

var checkUnused = require('./check-unused');
var processData = require('./process-data');
var mergeData = require('./merge-data');
var q = require('q');

function npmCheck(dir) {

    return q.all([
        checkUnused(dir),
        processData(dir)
    ])
    .spread(mergeData);
}

module.exports = npmCheck;