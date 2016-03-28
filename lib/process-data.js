'use strict';

const modulesOfPackage = require('./util/modules-of-package');
const readPackageJson = require('./util/read-package-json');
const getNpmInfo = require('./npm/get-npm-info');
const _ = require('lodash');
const semver = require('semver');
const semverDiff = require('semver-diff');
const path = require('path');

function processModule(moduleName, currentState) {
    const rootPackageJson = currentState.get('packageJson');
    const modulePackageJson = readPackageJson(path.join(currentState.get('nodeModulesPath'), moduleName, 'package.json'));
    const isPrivate = modulePackageJson.private;
    if (isPrivate) {
        return false;
    }

    const unusedDependencies = currentState.get('unusedDependencies');

    return getNpmInfo(moduleName)
        .then(data => {
            const latest = data.latest;
            const versions = data.versions || [];
            const packageJsonVersion = rootPackageJson.dependencies[moduleName] ||
                rootPackageJson.devDependencies[moduleName] ||
                currentState.get('installed')[moduleName];
            const versionWanted = semver.maxSatisfying(versions, packageJsonVersion);
            const installedVersion = modulePackageJson.version;
            const versionToUse = installedVersion || versionWanted;
            const usingNonSemver = semver.valid(latest) && semver.lt(latest, '1.0.0-pre');

            const bump = semver.valid(latest) &&
                        semver.valid(versionToUse) &&
                        (usingNonSemver && semverDiff(versionToUse, latest) ? 'nonSemver' : semverDiff(versionToUse, latest));

            const unused = _.includes(unusedDependencies, moduleName);

            return {
                // info
                moduleName: moduleName,
                homepage: data.homepage,
                error: data.error,

                // versions
                latest: latest,
                installed: versionToUse,
                isInstalled: currentState.get('global') || installedVersion,
                notInstalled: !currentState.get('global') && !installedVersion,
                packageWanted: versionWanted,
                packageJson: packageJsonVersion,

                // private
                isPrivate: isPrivate,

                // meta
                devDependency: _.has(rootPackageJson.devDependencies, moduleName),
                usedInScripts: _.findKey(rootPackageJson.scripts, function (script) {
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
                bump: bump,

                unused: unused
            };
        });
}

function processData(currentState) {
    const rootPackageJson = currentState.get('packageJson');
    const promises = _.map(modulesOfPackage(rootPackageJson, currentState), moduleName => {
        return processModule(moduleName, currentState);
    });

    return Promise.all(promises)
        .then(function (dataInPromises) {
            const packages = _(dataInPromises)
                .compact()
                .keyBy('moduleName')
                .valueOf();

            currentState.set('packages', packages);
            return currentState;
        });
}

module.exports = processData;
