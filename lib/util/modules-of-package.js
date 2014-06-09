'use strict';

var _ = require('lodash');

function arrayOfModuleNames(packageJson) {
    return _([
            _.keys(packageJson.dependencies),
            _.keys(packageJson.devDependencies)
        ])
        .flatten()
        .unique()
        .sort()
        .valueOf();
}

module.exports = arrayOfModuleNames;