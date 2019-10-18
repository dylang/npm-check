'use strict';

const chalk = require('chalk');
const pm = require('./pm-speaker');
const emoji = require('./emoji');

function updateAll(currentState) {
    const packages = currentState.get('packages');

    if (currentState.get('debug')) {
        console.log('packages', packages);
    }

    const packagesToUpdate = packages.filter(packageEntry => packageEntry.mismatch || packageEntry.notInstalled || packageEntry.bump );

    if (!packagesToUpdate.length) {
        console.log(`${emoji(':heart:  ')}Your modules look ${chalk.bold('amazing')}. Keep up the great work.${emoji(' :heart:')}`);
        return;
    }

    const updatedPackages = packagesToUpdate
        .map(pkg => pkg.moduleName + '@' + pkg.latest).join(', ');

    const installer = currentState.get('installer');
    const installArgs = pm.pmCli(packagesToUpdate, currentState, 'upgrade');

    return pm.doInstall(currentState, installer, installArgs[0])
        .then(currentState => pm.doInstall(currentState, installer, installArgs[1]))
        .then(currentState => {
            console.log('');
            console.log(chalk.green(`[npm-check] Update complete!`));
            console.log(chalk.green('[npm-check] ' + updatedPackages));
            console.log(chalk.green(`[npm-check] You should re-run your tests to make sure everything works with the updates.`));
            return currentState;
        });
}

module.exports = updateAll;
