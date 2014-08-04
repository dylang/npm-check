'use strict';

var getInstalledVersion = require('./util/get-installed-version');
var modulesOfPackage = require('./util/modules-of-package');
var getNpmInfo = require('./npm/get-npm-info');
var _ = require('lodash');
var semver = require('semver');
var semverDiff = require('semver-diff');
var q = require('q');
var path = require('path');

function processModule(moduleName, packageJson, dir) {
    return getNpmInfo(moduleName)
        .then(function(data) {
            var latest = data && data.version || JSON.stringify(data);
            var installed = getInstalledVersion(dir, moduleName);
            var packageJsonVersion = packageJson.dependencies[moduleName] ||
                            packageJson.devDependencies[moduleName];

            return {
                // info
                moduleName: moduleName,
                homepage: data && data.homepage,

                // versions
                latest: latest,
                installed: installed,
                packageJson: packageJsonVersion,

                // meta
                devDependency: _.has(packageJson.devDependencies, moduleName),
                usedInScripts: _.findKey(packageJson.scripts, function(script) { return script.indexOf(moduleName) !== -1;}),

                mismatch: semver.validRange(packageJsonVersion) &&
                    semver.valid(installed) &&
                    !semver.satisfies(installed, packageJsonVersion),
                semver_validRange: semver.validRange(packageJsonVersion),
                semver_valid:
                    semver.valid(installed),
                easy_upgrade: semver.validRange(packageJsonVersion) &&
                    semver.valid(installed) &&
                    semver.satisfies(latest, packageJsonVersion),
                bump: semver.valid(latest) &&
                    semver.valid(installed) &&
                    semverDiff(installed, latest)
            };
        });
}

function processData(dir) {

    var projectPackageJson = _.merge(require(path.join(dir, 'package.json')), { devDependencies: {}, dependencies: {}});

    var promises = _.map(modulesOfPackage(projectPackageJson), function(moduleName) {
        return processModule(moduleName, projectPackageJson, dir);
    });

    return q.allSettled(promises)
        .then(function(dataInPromises) {
            var data = _(dataInPromises).map(function(promiseResult) {
                    if (promiseResult.state === 'fulfilled'){
                        return promiseResult.value;
                    }
                    console.log('Error running promise: ', promiseResult.reason.stack);
                })
                .compact()
                .indexBy('moduleName')
                .valueOf();

            return q.resolve(data);
        });
}

module.exports = processData;
