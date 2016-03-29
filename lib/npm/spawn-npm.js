'use strict';

const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

function install(packages, currentState) {
    if (!packages.length) {
        return;
    }

    const installGlobal = currentState.get('global') ? '--global' : null;
    const saveExact = currentState.get('saveExact') ? '--save-exact' : null;

    const npmArgs = ['install']
        .concat(installGlobal)
        .concat(saveExact)
        .concat(packages)
        .filter(Boolean);

    const spinner = ora(`${chalk.green('npm')} ${chalk.green(npmArgs.join(' '))}`);
    spinner.start();

    return execa('npm', npmArgs, {cwd: currentState.get('cwd')}).then(output => {
        spinner.stop();
        console.log(output.stdout);
        console.log(output.stderr);
    });
}

module.exports = {
    install
};
