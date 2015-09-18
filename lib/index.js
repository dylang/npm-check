'use strict';

var checkUnused = require('./check-unused');
var processData = require('./process-data');
var mergeData = require('./merge-data');
var globalModulesPath = require('global-modules');
var readPackageJson = require('./util/read-package-json');
var path = require('path');
var q = require('q');
var _ = require('lodash');

function npmCheck(options) {
    options = _.extend({}, options);

    if (options.global) {
        options.path = globalModulesPath;
    } else {
        options.path = options.path || process.cwd();
    }

    if (options.debug) {
        console.log({options: options});
    }

    options.packageJson = readPackageJson(path.join(options.path, 'package.json'));

    return q.all([
        checkUnused(options),
        processData(options)
    ])
    .spread(mergeData);
}

module.exports = npmCheck;
