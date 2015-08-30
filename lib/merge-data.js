'use strict';

var _ = require('lodash');

function mergeData(unusedDependencies, modules) {
    return _.mapValues(modules, function (moduleData, moduleName) {
        return _.extend(moduleData, {
            unused: !moduleData.usedInScripts && unusedDependencies &&
                (_.contains(unusedDependencies.dependencies, moduleName) ||
                _.contains(unusedDependencies.devDependencies, moduleName))
        });
    });
}

module.exports = mergeData;
