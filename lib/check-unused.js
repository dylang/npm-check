'use strict';

var q = require('q');
var depcheck = require('depcheck');
var _ = require('lodash');

function checkUnused(options){
    var defer = q.defer();

    if (options.package || options.skipUnused) {
        return defer.resolve();
    }

    var depCheckOptions = {
        ignoreDirs: [
            'sandbox',
            'dist',
            'generated',
            '.generated'
        ],
        ignoreMatches: [
            'grunt-*',
            'karma-*',
            'angular-*'
        ]
    };

    depcheck(options.path, depCheckOptions, function(unused) {
        return defer.resolve(unused);
    });
    return defer.promise;
}

module.exports = checkUnused;
