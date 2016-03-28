'use strict';

const depcheck = require('depcheck');

function skipUnused(currentState) {
    return currentState.get('skipUnused') ||     // manual option to ignore this
        currentState.get('global') ||            // global modules
        currentState.get('update') ||            // in the process of doing an update
        !currentState.get('packageJson').name;   // there's no package.json
}

function checkUnused(currentState) {
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
                'angular-*'
            ]
        };

        depcheck(currentState.get('path'), depCheckOptions, resolve);
    }).then(depCheckResults => {
        const unusedDependencies = [].concat(depCheckResults.dependencies, depCheckResults.devDependencies);
        currentState.set('unusedDependencies', unusedDependencies);
        return currentState;
    });
}

module.exports = checkUnused;
