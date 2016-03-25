'use strict';

const modulesOfPackage = require('./util/modules-of-package');
const readPackageJson = require('./util/read-package-json');
const getNpmInfo = require('./npm/get-npm-info');
const _ = require('lodash');
const semver = require('semver');
const semverDiff = require('semver-diff');
const path = require('path');
const globby = require('globby');

function processModule(moduleName, parentPackageJson, options) {
    const dir = options.path;
    const modulePackageJson = readPackageJson(path.join(dir, options.global ? '' : 'node_modules', moduleName, 'package.json'));
    const isPrivate = modulePackageJson.private;

    if (isPrivate) {
        return false;
    }

    return getNpmInfo(moduleName)
        .then(data => {
            const latest = data.latest;
            const versions = data.versions || [];
            const packageJsonVersion = parentPackageJson.dependencies[moduleName] ||
                parentPackageJson.devDependencies[moduleName] ||
                parentPackageJson.installed[moduleName];
            const versionWanted = semver.maxSatisfying(versions, packageJsonVersion);
            const installedVersion = modulePackageJson.version;
            const versionToUse = installedVersion || versionWanted;
            const usingNonSemver = semver.valid(latest) && semver.lt(latest, '1.0.0-pre');

            const bump = semver.valid(latest) &&
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
                devDependency: _.has(parentPackageJson.devDependencies, moduleName),
                usedInScripts: _.findKey(parentPackageJson.scripts, function (script) {
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
    const projectPackageJson = options.packageJson;

    const nodeModulesPath = _.endsWith(options.path, 'node_modules') ? options.path :
        path.join(options.path, 'node_modules');

    const installedPackages = options.global ? globby.sync(path.resolve(nodeModulesPath, '{*/package.json,@*/*/package.json}')) : false;

    projectPackageJson.installed = _(installedPackages)
        .map(function (pkgPath) {
            const pkg = readPackageJson(path.resolve(pkgPath));
            return [pkg.name, pkg.version];
        })
        .fromPairs()
        .valueOf();

    const promises = _.map(modulesOfPackage(projectPackageJson, options), moduleName => {
        return processModule(moduleName, projectPackageJson, options);
    });

    return Promise.all(promises)
        .then(function (dataInPromises) {
            const data = _(dataInPromises)
                .compact()
                .keyBy('moduleName')
                .valueOf();

            return Promise.resolve(data);
        });
}

module.exports = processData;
