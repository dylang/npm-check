'use strict';

const _ = require('lodash');

function mergeData(data) {
    const unusedDependencies = data[0];
    const modules = data[1];

    return _.mapValues(modules, (moduleData, moduleName) => {
        return _.extend(moduleData, {
            unused: !moduleData.usedInScripts && unusedDependencies &&
                (_.includes(unusedDependencies.dependencies, moduleName) ||
                _.includes(unusedDependencies.devDependencies, moduleName))
        });
    });
}

module.exports = mergeData;
