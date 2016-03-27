'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');
const options = require('../util/options');

function spawnNpm(command, args) {
    const globalOption = options.get('global') ? '-g' : null;
    const colorOption = chalk.supportsColor ? '--color=always' : null;
    const saveExact = options.get('saveExact') ? '--save-exact' : null;

    if (!command || !args || !args.length) {
        return Promise.resolve();
    }

    var npmArgs = _([command])
        .concat(globalOption)
        .concat(colorOption)
        .concat(saveExact)
        .concat(args)
        .compact()
        .valueOf();

    const spinner = ora(`Running ${chalk.green('npm')} ${chalk.green(npmArgs.join(' '))}`);
    spinner.start();

    return execa('npm', npmArgs).then(output => {
        spinner.stop();
        console.log(output.stdout);
        console.log(output.stderr);
    });
}

function install(packages) {
    return spawnNpm('install', packages);
}

module.exports = {
    install: install
};
