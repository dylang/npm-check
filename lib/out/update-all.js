'use strict';

const _ = require('lodash');
const inquirer = require('inquirer');
const chalk = require('chalk');
const table = require('text-table');
const installPackages = require('./install-packages');
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

    const saveDependencies = packagesToUpdate
        .filter(pkg => !pkg.devDependency)
        .map(pkg => pkg.moduleName + '@' + pkg.latest);

    const saveDevDependencies = packagesToUpdate
        .filter(pkg => pkg.devDependency)
        .map(pkg => pkg.moduleName + '@' + pkg.latest);

    const updatedPackages = packagesToUpdate
        .map(pkg => pkg.moduleName + '@' + pkg.latest).join(', ');

    if (!currentState.get('global')) {
        if (saveDependencies.length) {
            saveDependencies.unshift('--save');
        }

        if (saveDevDependencies.length) {
            saveDevDependencies.unshift('--save-dev');
        }
    }

    return installPackages(saveDependencies, currentState)
        .then(currentState => installPackages(saveDevDependencies, currentState))
        .then(currentState => {
            console.log('');
            console.log(chalk.green(`[npm-check] Update complete!`));
            console.log(chalk.green('[npm-check] ' + updatedPackages));
            console.log(chalk.green(`[npm-check] You should re-run your tests to make sure everything works with the updates.`));
            return currentState;
        });
}

module.exports = updateAll;
