'use strict';

const _ = require('lodash');

// DYLAN - cleanup
function arrayOfModuleNames(packageJson, currentState) {
    const PACKAGE_LISTS = [
        'dependencies',
        'devDependencies'
    ];

    const allModules = _(packageJson)
        .pick(PACKAGE_LISTS)
        .merge({installed: currentState.get('installed')})
        .values()
        .reduce(function (arr, val) {
            return _.extend(arr, val);
        }, {});

    return _(allModules)
        .keys()
        .uniq()
        .difference(currentState.get('ignoreDev') && _.keys(packageJson.devDependencies))
        .sort((a, b) => {
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
