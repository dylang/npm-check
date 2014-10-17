'use strict';

var _ = require('lodash');

function arrayOfModuleNames(packageJson, options) {
    return _([
            _.keys(packageJson.dependencies),
            _.keys(!options.ignoreDev && packageJson.devDependencies)
        ])
        .flatten()
        .unique()
        .sort()
        .valueOf();
}

module.exports = arrayOfModuleNames;