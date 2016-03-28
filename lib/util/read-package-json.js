'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const emoji = require('./emoji');
// var readPkg = require('read-pkg');

function readPackageJson(filename) {
    let pkg;
    try {
        pkg = require(filename);
    } catch (e) {
        // DYLAN TODO: change this to update state instead of console log
        if (e.code === 'MODULE_NOT_FOUND') {
            console.log(emoji(':warning:  ') + 'Package.json not found.');
        } else {
            console.log(emoji(':warning:  ') + 'Package.json is not valid.');
        }
        console.log(chalk.red(e.message));
        // pkg = {'npm-check': {error: true}};
    }
    return _.merge(pkg, {devDependencies: {}, dependencies: {}});
}

module.exports = readPackageJson;
