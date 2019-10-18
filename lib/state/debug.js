'use strict';
const chalk = require('chalk');

function debug(...args) {
    console.log(chalk.green('[npm-check] debug'));
    console.log(...args);
    console.log(`${chalk.green('===============================')}`);
}

module.exports = debug;
