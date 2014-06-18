'use strict';

var q = require('q');
var depcheck = require('depcheck');
var _ = require('lodash');

function checkUnused(dir){
    var defer = q.defer();

    var options = {
        ignoreDirs: [
            'sandbox',
            'dist'
        ],
        ignoreMatches: [
            'grunt-*',
            'karma-*',
            'angular-*'
        ]
    };

    depcheck(dir || process.cwd(), options, function(unused) {
        return defer.resolve(unused);
    });
    return defer.promise;
}

module.exports = checkUnused;
