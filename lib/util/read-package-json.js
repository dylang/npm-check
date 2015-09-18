'use strict';

var _ = require('lodash');

function readPackageJson(filename) {
    var pkg;
    try {
        pkg = require(filename);
    } catch (e) {
        pkg = {};
    }
    return _.merge(pkg, {devDependencies: {}, dependencies: {}});
}

module.exports = readPackageJson;
