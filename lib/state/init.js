'use strict';
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const globalModulesPath = require('global-modules');
const globalModulesPathYarn = require('yarn-global-modules');
const chalk = require('chalk');
const readPackageJson = require('../in/read-package-json');
const globalPackages = require('../in/get-installed-packages');
const emoji = require('../out/emoji');

function globalModules(pm) {
    const pmName = pm.split('@', 1)[0];
    if (pmName === 'yarn') {
        return globalModulesPathYarn();
    }

    if (pmName !== 'npm') {
        console.log(chalk.yellow(`warning: Using npm's global module directory because we don't know enough about ${pm}`));
    }

    return globalModulesPath;
}

function init(currentState, userOptions) {
    return new Promise((resolve, reject) => {
        _.each(userOptions, (value, key) => currentState.set(key, value));

        if (currentState.get('global')) {
            let modulesPath = globalModules(currentState.get('installer'));

            if (process.env.NODE_PATH) {
                if (process.env.NODE_PATH.includes(path.delimiter)) {
                    modulesPath = process.env.NODE_PATH.split(path.delimiter)[0];
                    console.log(chalk.yellow('warning: Using the first of multiple paths specified in NODE_PATH'));
                } else {
                    modulesPath = process.env.NODE_PATH;
                }
            }

            if (!fs.existsSync(modulesPath)) {
                throw new Error('Path "' + modulesPath + '" does not exist. Please check the NODE_PATH environment variable.');
            }

            console.log(chalk.green('The global path you are searching is: ' + modulesPath));

            currentState.set('cwd', globalModulesPath);
            currentState.set('globalPackages', globalPackages(modulesPath));
        } else {
            const cwd = path.resolve(currentState.get('cwd'));
            const pkg = readPackageJson(path.join(cwd, 'package.json'));
            currentState.set('cwdPackageJson', pkg);
            currentState.set('cwd', cwd);
        }

        emoji.enabled(currentState.get('emoji'));

        if (currentState.get('cwdPackageJson').error) {
            return reject(currentState.get('cwdPackageJson').error);
        }

        return resolve(currentState);
    });
}

module.exports = init;
