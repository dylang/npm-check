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
        options.packageJson = {devDependencies: {}, dependencies: {}};
    } else {
        const userPath = options.path || process.cwd();
        options.packageJson = readPackageJson(path.join(userPath, 'package.json'));
        options.path = path.join(userPath, 'node_modules');
    }

    if (options.debug) {
        console.log({options: options});
    }

    if (options.packageJson['npm-check'] && options.packageJson['npm-check'].error) {
        return q.resolve();
    }

    return q.all([
        checkUnused(options),
        processData(options)
    ])
    .spread(mergeData);
}

module.exports = npmCheck;
