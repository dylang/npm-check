'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var emoji = require('node-emoji');
// var readPkg = require('read-pkg');

function readPackageJson(filename) {
    var pkg;
    try {
        pkg = require(filename);
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            console.log(emoji.get('warning') + '  package.json not found.');
        } else {
            console.log(emoji.get('warning') + '  package.json is not valid.');
        }
        console.log(chalk.red(e.message));
        pkg = {'npm-check': {error: true}};
    }
    return _.merge(pkg, {devDependencies: {}, dependencies: {}});
}

module.exports = readPackageJson;
