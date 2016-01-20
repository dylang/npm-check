'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var emoji = require('node-emoji');

function readPackageJson(filename) {
    var pkg;
    try {
        pkg = require(filename);
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            console.log(emoji.get('warning') + '  Package JSON ' + chalk.bold('missing') + '. Create it and try again.' + emoji.get('warning'));
        } else {
            console.log(emoji.get('warning') + '  Package JSON ' + chalk.bold('malformed') + '. Repair it and try again.' + emoji.get('warning'));
        }
        console.log(chalk.red(e.message));
        pkg = {'npm-check': {error: true}};
    }
    return _.merge(pkg, {devDependencies: {}, dependencies: {}});
}

module.exports = readPackageJson;
