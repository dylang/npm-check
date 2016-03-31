'use strict';

const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

function install(packages, currentState, installer) {
    if (!packages.length) {
        return Promise.resolve(currentState);
    }
    if (typeof installer !== 'string') {
        installer = 'npm';
    }

    const installGlobal = currentState.get('global') ? '--global' : null;
    const saveExact = currentState.get('saveExact') ? '--save-exact' : null;
    const color = chalk.supportsColor ? '--color=always' : null;

    const npmArgs = ['install']
        .concat(installGlobal)
        .concat(saveExact)
        .concat(packages)
        .concat(color)
        .filter(Boolean);

    const logMessage = `${chalk.green(installer)} ${chalk.green(npmArgs.join(' '))}`;
    const spinner = ora(logMessage);
    spinner.start();

    return execa(installer, npmArgs, {cwd: currentState.get('cwd')}).then(output => {
        spinner.stop();
        console.log(logMessage);
        if (installer !== 'pnpm') { // dirty output at pnpm... :(
            console.log(output.stdout);
        }
        console.log(output.stderr);

        return currentState;
    });
}

module.exports = {
    install
};
