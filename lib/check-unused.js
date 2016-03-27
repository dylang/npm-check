'use strict';

const depcheck = require('depcheck');
const options = require('./util/options');

function skipUnused() {
    return options.get('skipUnused') ||     // manual option to ignore this
        options.get('global') ||            // global modules
        options.get('update') ||            // in the process of doing an update
        !options.get('packageJson').name;   // there's no package.json
}

function checkUnused() {
    if (skipUnused()) {
        return false;
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

    return new Promise(resolve => depcheck(options.get('path'), depCheckOptions, resolve));
}

module.exports = checkUnused;
