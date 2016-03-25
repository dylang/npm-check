'use strict';

var _ = require('lodash');
var chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

function spawnNpm(command, args, options) {
    var globalOption = options.global ? '-g' : null;
    var colorOption = chalk.supportsColor ? '--color=always' : null;
    var saveExact = options.saveExact ? '--save-exact' : null;

    if (!command || !args || !args.length || !options) {
        return Promise.resolve();
    }

    var npmArgs = _([command])
        .concat(globalOption)
        .concat(colorOption)
        .concat(saveExact)
        .concat(args)
        .compact()
        .valueOf();

    const spinner = ora('Running ' + chalk.green('npm ' + npmArgs.join(' ')))
    spinner.start();

    return execa('npm', npmArgs).then( output => {
        spinner.stop();
        console.log(output.stdout);
        console.log(output.stderr);
    });
}

function install(packages, options) {
    return spawnNpm('install', packages, options);
}

module.exports = {
    install: install
};
