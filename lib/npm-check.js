'use strict';

var checkUnused = require('./check-unused');
var processData = require('./process-data');
var mergeData = require('./merge-data');
var getConf = require('./npm/get-conf');
var readPackageJson = require('./util/read-package-json');
var path = require('path');
var q = require('q');

function npmCheck(options) {

    //q.longStackSupport = true;

    return getConf.getGlobalNodeModulesPath()
        .then(function(globalPrefx){
            if (options.global) {
                options.path = globalPrefx;
            } else {
                options.path = options.path || process.cwd();
            }

            options.packageJson = readPackageJson(path.join(options.path, 'package.json'));

            return q.all([
                checkUnused(options),
                processData(options)
            ])
            .spread(mergeData);
        });

}

module.exports = npmCheck;