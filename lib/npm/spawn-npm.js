'use strict';

const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

function install(packages, currentState) {
    const colorOption = chalk.supportsColor ? '--color=always' : null;
    const installGlobal = currentState.get('global') ? '-g' : null;
    const saveExact = currentState.get('saveExact') ? '--save-exact' : null;

    const npmArgs = ['install']
        .concat(colorOption)
        .concat(installGlobal)
        .concat(saveExact)
        .concat(packages)
        .filter(Boolean);

    const spinner = ora(`Running ${chalk.green('npm')} ${chalk.green(npmArgs.join(' '))}`);
    spinner.start();

    return execa('npm', npmArgs).then(output => {
        spinner.stop();
        console.log(output.stdout);
        console.log(output.stderr);
    });
}

module.exports = {
    install
};
