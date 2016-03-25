'use strict';

const depcheck = require('depcheck');

function checkUnused(options) {
    if (options.global || options.update || options.packages || options.skipUnused || !options.packageJson.name) {
        return Promise.resolve();
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

    return new Promise(resolve => depcheck(options.path, depCheckOptions, resolve));
}

module.exports = checkUnused;
