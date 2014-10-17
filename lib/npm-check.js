'use strict';

var checkUnused = require('./check-unused');
var processData = require('./process-data');
var mergeData = require('./merge-data');
var q = require('q');
var path = require('path');

function npmCheck(options) {

    if (!options.package) {
        try {
            require(path.join(dir, 'package.json'));
        } catch (err) {
            return q.reject('npm-check currently only works in directories that have a package.json.');
        }
    }

    return q.all([
        checkUnused(options),
        processData(options)
    ])
    .spread(mergeData);
}

module.exports = npmCheck;