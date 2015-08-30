'use strict';

var _ = require('lodash');

function arrayOfModuleNames(packageJson, options) {
    var PACKAGE_LISTS = [
        'dependencies',
        'devDependencies',
        'installed'
    ];

    var allModules = _(packageJson)
        .pick(PACKAGE_LISTS)
        .values()
        .reduce(function (arr, val) {
            return _.extend(arr, val);
        }, {});

    return _(allModules)
        .keys()
        .unique()
        .difference(options.ignoreDev && _.keys(packageJson.devDependencies))
        .sort()
        .sort(function (a, b) {
            if (packageJson.devDependencies[a] && !packageJson.devDependencies[b]) {
                return 1;
            }
            if (packageJson.devDependencies[b] && !packageJson.devDependencies[a]) {
                return -1;
            }
            return a > b;
        })
        .valueOf();
}

module.exports = arrayOfModuleNames;
