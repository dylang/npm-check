'use strict';

const checkUnused = require('./check-unused');
const processData = require('./process-data');
const mergeData = require('./merge-data');
const globalModulesPath = require('global-modules');
const readPackageJson = require('./util/read-package-json');
const path = require('path');
const _ = require('lodash');

function npmCheck(options) {
    options = _.extend({}, options);

    if (options.global) {
        options.path = globalModulesPath;
        options.packageJson = {devDependencies: {}, dependencies: {}};
    } else {
        const userPath = options.path || process.cwd();
        options.packageJson = readPackageJson(path.join(userPath, 'package.json'));
        options.path = userPath;
    }

    if (options.debug) {
        console.log({options: options});
    }

    if (options.packageJson['npm-check'] && options.packageJson['npm-check'].error) {
        return Promise.resolve();
    }

    return Promise.all([
        checkUnused(options),
        processData(options)
    ])
    .then(mergeData);
}

module.exports = npmCheck;
