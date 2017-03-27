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

function checkUnused(currentState) {
    const spinner = ora(`Checking for unused packages. --skip-unused if you don't want this.`);
    spinner.enabled = spinner.enabled && currentState.get('spinner');
    spinner.start();
    const defaultIgnoreDirs = [
        'sandbox',
        'dist',
        'generated',
        '.generated',
        'build',
        'fixtures',
        'jspm_packages'
    ];
    const ignoreDirs = defaultIgnoreDirs.concat(currentState.get('ignoreDirs'));

    return new Promise(resolve => {
        if (skipUnused(currentState)) {
            resolve(currentState);
        }

        const depCheckOptions = {
            ignoreDirs: ignoreDirs,
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
            ]
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
