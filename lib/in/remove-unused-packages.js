'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const skipUnused = require('./skip-unused-packages');
const _ = require('lodash');

function skipAutoRemove(currentState) {
    return skipUnused(currentState) || !currentState.get('removeUnused');
}

function removeUnused(currentState) {
    const dependenciesToRemove = currentState.get('unusedDependencies');
    if (skipAutoRemove(currentState) || _.isEmpty(dependenciesToRemove)) {
        return Promise.resolve(currentState);
    }

    const spinner = ora(`Remove unused dependencies. --skip-unused if you don't want this.`);
    spinner.enabled = spinner.enabled && currentState.get('spinner');
    spinner.start();

    return new Promise(resolve => {
        const removeCommand = 'npm remove --save ' + dependenciesToRemove.join(' ');
        exec(removeCommand, {cwd: currentState.get('cwd')}, (error, stdout, stderr) => {
            if (error || !_.isEmpty(stderr)) {
                currentState.set('removeUnusedError', error);
            }
            resolve(currentState);
        });
    }).then(result => {
        spinner.stop();
        return currentState;
    });
}

module.exports = removeUnused;
