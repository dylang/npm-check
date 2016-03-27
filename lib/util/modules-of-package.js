'use strict';

const _ = require('lodash');
const options = require('./options');

function arrayOfModuleNames(packageJson) {
    const PACKAGE_LISTS = [
        'dependencies',
        'devDependencies'
    ];

    // DYLAN - cleanup
    const allModules = _(packageJson)
        .pick(PACKAGE_LISTS)
        .merge({installed: options.get('installed')})
        .values()
        .reduce(function (arr, val) {
            return _.extend(arr, val);
        }, {});

    return _(allModules)
        .keys()
        .uniq()
        .difference(options.get('ignoreDev') && _.keys(packageJson.devDependencies))
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
