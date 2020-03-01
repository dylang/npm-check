'use strict';

const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

function install(packages, currentState) {
    if (!packages.length) {
        return Promise.resolve(currentState);
    }

    const installer = currentState.get('installer');
    const saveExact = currentState.get('saveExact')

    const isYarn = installer === 'yarn';
    const exact = saveExact ? (isYarn ? '--exact' : '--save-exact') : null;
    const color = chalk.supportsColor ? '--color=always' : null;

    const install = [isYarn ? 'add' : 'install'];
    if (currentState.get('global')) {
        isYarn ? install.unshift('global') : install.push('--global');
    }
    const args = install
        .concat(packages)
        .concat(exact)
        .concat(color)
        .filter(Boolean);

    console.log('');
    console.log(`$ ${chalk.green(installer)} ${chalk.green(args.join(' '))}`);
    const spinner = ora(`Installing using ${chalk.green(installer)}...`);
    spinner.enabled = spinner.enabled && currentState.get('spinner');
    spinner.start();

    return execa(installer, args, {cwd: currentState.get('cwd')}).then(output => {
        spinner.stop();
        console.log(output.stdout);
        console.log(output.stderr);

        return currentState;
    }).catch(err => {
        spinner.stop();
        throw err;
    });
}

module.exports = install;
