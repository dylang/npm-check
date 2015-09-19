'use strict';

var q = require('q');
var depcheck = require('depcheck-es6');

function checkUnused(options) {
    var defer = q.defer();

    if (options.global || options.update || options.packages || options.skipUnused || !options.packageJson.name) {
        return defer.resolve();
    }

    var depCheckOptions = {
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

    depcheck(options.path, depCheckOptions, function (unused) {
        return defer.resolve(unused);
    });
    return defer.promise;
}

module.exports = checkUnused;
