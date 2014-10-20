'use strict';

var _ = require('lodash');

function arrayOfModuleNames(packageJson, options) {

    var PACKAGE_LISTS = [
        'dependencies',
        'devDependencies',
        //'optionalDependencies',
        //'peerDependencies',
        'installed'
    ];

     var allModules = _(packageJson)
        .pick(PACKAGE_LISTS)
        .values()
         .reduce(function(arr, val){
             return _.extend(arr, val);
         }, {});

    return _(allModules)
        .keys()
        .unique()
        .difference(options.ignoreDev && _.keys(packageJson.devDependencies))
        .sort()
        .valueOf();
}

module.exports = arrayOfModuleNames;