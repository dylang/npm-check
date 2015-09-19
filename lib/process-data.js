'use strict';

var modulesOfPackage = require('./util/modules-of-package');
var readPackageJson = require('./util/read-package-json');
var getNpmInfo = require('./npm/get-npm-info');
var _ = require('lodash');
var semver = require('semver');
var semverDiff = require('semver-diff');
var q = require('q');
var path = require('path');
var globby = require('globby');

function processModule(moduleName, packageJson, options) {
    var dir = options.path;
    var projectPackageJson = readPackageJson(path.join(dir, 'node_modules', moduleName, 'package.json'));
    var isPrivate = projectPackageJson.private;

    if (isPrivate) {
        return false;
    }

    return getNpmInfo(moduleName)
        .then(function (data) {
            var latest = data.latest;
            var versions = data.versions || [];
            var packageJsonVersion = packageJson.dependencies[moduleName] ||
                packageJson.devDependencies[moduleName] ||
                packageJson.installed[moduleName];
            var versionWanted = semver.maxSatisfying(versions, packageJsonVersion);
            var installedVersion = projectPackageJson.version;
            var versionToUse = installedVersion || versionWanted;
            var usingNonSemver = semver.valid(latest) && semver.lt(latest, '1.0.0-pre');

            var bump = semver.valid(latest) &&
                        semver.valid(versionToUse) &&
                        (usingNonSemver && semverDiff(versionToUse, latest) ? 'nonSemver' : semverDiff(versionToUse, latest));

            return {
                // info
                moduleName: moduleName,
                homepage: data.homepage,
                error: data.error,

                // versions
                latest: latest,
                installed: versionToUse,
                isInstalled: options.global || installedVersion,
                notInstalled: !options.global && !installedVersion,
                packageWanted: versionWanted,
                packageJson: packageJsonVersion,

                // private
                isPrivate: isPrivate,

                // meta
                devDependency: _.has(packageJson.devDependencies, moduleName),
                usedInScripts: _.findKey(packageJson.scripts, function (script) {
                    return script.indexOf(moduleName) !== -1;
                }),
                mismatch: semver.validRange(packageJsonVersion) &&
                    semver.valid(versionToUse) &&
                    !semver.satisfies(versionToUse, packageJsonVersion),
                semverValidRange: semver.validRange(packageJsonVersion),
                semverValid:
                    semver.valid(versionToUse),
                easyUpgrade: semver.validRange(packageJsonVersion) &&
                    semver.valid(versionToUse) &&
                    semver.satisfies(latest, packageJsonVersion),
                bump: bump
            };
        });
}

function processData(options) {
    var projectPackageJson = options.packageJson;

    var nodeModulesPath = _.endsWith(options.path, 'node_modules') ? options.path :
        path.join(options.path, 'node_modules');

    var installedPackages = options.global ? globby.sync(path.resolve(nodeModulesPath, '*/package.json')) : false;

    projectPackageJson.installed = _(installedPackages)
        .map(function (pkgPath) {
            var pkg = readPackageJson(path.resolve(options.path, pkgPath));
            return [pkg.name, pkg.version];
        })
        .zipObject()
        .valueOf();

    var promises = _.map(modulesOfPackage(projectPackageJson, options), function (moduleName) {
        return processModule(moduleName, projectPackageJson, options);
    });

    return q.allSettled(promises)
        .then(function (dataInPromises) {
            var data = _(dataInPromises).map(function (promiseResult) {
                if (promiseResult.state === 'fulfilled') {
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
