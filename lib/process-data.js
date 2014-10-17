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
            var packageJsonVersion = packageJson.dependencies[moduleName] ||
                            packageJson.devDependencies[moduleName];
            var versionWanted = semver.maxSatisfying(data.versions, packageJsonVersion);
            var installedVersion = getInstalledVersion(dir, moduleName);
            var versionToUse = installedVersion || versionWanted;

            return {
                // info
                moduleName: moduleName,
                homepage: data && data.homepage,

                // versions
                latest: latest,
                installed: versionToUse,
                isInstalled: installedVersion,
                packageWanted: versionWanted,
                packageJson: packageJsonVersion,

                // meta
                devDependency: _.has(packageJson.devDependencies, moduleName),
                usedInScripts: _.findKey(packageJson.scripts, function(script) { return script.indexOf(moduleName) !== -1;}),

                mismatch: semver.validRange(packageJsonVersion) &&
                    semver.valid(versionToUse) &&
                    !semver.satisfies(versionToUse, packageJsonVersion),
                semver_validRange: semver.validRange(packageJsonVersion),
                semver_valid:
                    semver.valid(versionToUse),
                easy_upgrade: semver.validRange(packageJsonVersion) &&
                    semver.valid(versionToUse) &&
                    semver.satisfies(latest, packageJsonVersion),
                bump: semver.valid(latest) &&
                    semver.valid(versionToUse) &&
                    semverDiff(versionToUse, latest)
            };
        });
}

function processData(options) {

    var projectPackageJson = _.merge(require(path.join(options.path, 'package.json')), { devDependencies: {}, dependencies: {}});

    var promises = _.map(modulesOfPackage(projectPackageJson, options), function(moduleName) {
        return processModule(moduleName, projectPackageJson, options.path);
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
