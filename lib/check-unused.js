'use strict';

const depcheck = require('depcheck');
const ora = require('ora');

function skipUnused(currentState) {
    return currentState.get('skipUnused') ||        // manual option to ignore this
        currentState.get('global') ||               // global modules
        currentState.get('update') ||               // in the process of doing an update
        !currentState.get('cwdPackageJson').name;   // there's no package.json
}

function checkUnused(currentState) {
    const spinner = ora(`Checking for unused packages. --skip-unused if you don't want this.`);
    spinner.enabled = currentState.get('spinner');
    spinner.start();

    return new Promise(resolve => {
        if (skipUnused(currentState)) {
            resolve(currentState);
        }

        const depCheckOptions = {
            ignoreDirs: [
                'sandbox',
                'dist',
                'generated',
                '.generated',
                'build',
                'fixtures'
            ],
            ignoreMatches: [
                'gulp-*',
                'grunt-*',
                'karma-*',
                'angular-*',
                'babel-*',
                'grunt'
            ]
        };

        depcheck(currentState.get('cwd'), depCheckOptions, resolve);
    }).then(depCheckResults => {
        spinner.stop();
        const unusedDependencies = [].concat(depCheckResults.dependencies, depCheckResults.devDependencies);
        currentState.set('unusedDependencies', unusedDependencies);
        return currentState;
    });
}

module.exports = checkUnused;
