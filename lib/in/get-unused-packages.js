'use strict';

const depcheck = require('depcheck');
const ora = require('ora');
const _ = require('lodash');

function skipUnused(currentState) {
    return currentState.get('skipUnused') ||        // manual option to ignore this
        currentState.get('global') ||               // global modules
        currentState.get('update') ||               // in the process of doing an update
        !currentState.get('cwdPackageJson').name;   // there's no package.json
}

function getSpecialParsers(currentState) {
    const specialsInput = currentState.get('specials');
    if (!specialsInput) return;
    return specialsInput
        .split(',')
        .map((special) => depcheck.special[special])
        .filter(Boolean);
}

function checkUnused(currentState) {
    const spinner = ora(`Checking for unused packages. --skip-unused if you don't want this.`);
    spinner.enabled = spinner.enabled && currentState.get('spinner');
    spinner.start();

    return new Promise(resolve => {
        if (skipUnused(currentState)) {
            resolve(currentState);
            return;
        }

        const depCheckOptions = {
            ignoreDirs: [
                'sandbox',
                'dist',
                'generated',
                '.generated',
                'build',
                'fixtures',
                'jspm_packages'
            ],
            ignoreMatches: [
                'gulp-*',
                'grunt-*',
                'karma-*',
                'angular-*',
                'babel-*',
                'metalsmith-*',
                'eslint-plugin-*',
                '@types/*',
                'grunt',
                'mocha',
                'ava'
            ],
            specials: getSpecialParsers(currentState)
        };

        depcheck(currentState.get('cwd'), depCheckOptions, resolve);
    }).then(depCheckResults => {
        spinner.stop();
        const unusedDependencies = [].concat(depCheckResults.dependencies, depCheckResults.devDependencies);
        currentState.set('unusedDependencies', unusedDependencies);

        const cwdPackageJson = currentState.get('cwdPackageJson');

        // currently missing will return devDependencies that aren't really missing
        const missingFromPackageJson = _.omit(depCheckResults.missing || {},
                    Object.keys(cwdPackageJson.dependencies), Object.keys(cwdPackageJson.devDependencies));
        currentState.set('missingFromPackageJson', missingFromPackageJson);
        return currentState;
    });
}

module.exports = checkUnused;
