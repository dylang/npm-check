'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const emoji = require('node-emoji');
// var readPkg = require('read-pkg');

function readPackageJson(filename) {
    let pkg;
    try {
        pkg = require(filename);
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            console.log(emoji.get('warning') + '  package.json not found.');
        } else {
            console.log(emoji.get('warning') + '  package.json is not valid.');
        }
        console.log(chalk.red(e.message));
        // pkg = {'npm-check': {error: true}};
    }
    return _.merge(pkg, {devDependencies: {}, dependencies: {}});
}

module.exports = readPackageJson;
