'use strict';

const readPackageJson = require('./util/read-package-json');
const getNpmInfo = require('./npm/get-npm-info');
const _ = require('lodash');
const semver = require('semver');
const semverDiff = require('semver-diff');
const path = require('path');
const pathExists = require('path-exists');
const merge = require('merge-options');
const ora = require('ora');

let spinner;


function processModule(moduleName, currentState) {
    const cwdPackageJson = currentState.get('cwdPackageJson');

    const modulePath = path.join(currentState.get('nodeModulesPath'), moduleName);
    const packageIsInstalled = pathExists.sync(modulePath);
    const modulePackageJson = readPackageJson(path.join(modulePath, 'package.json'));

    // Ignore private packages
    const isPrivate = Boolean(modulePackageJson.private);
    if (isPrivate) {
        return false;
    }

    // Ignore packages that are using github or file urls
    const packageJsonVersion = cwdPackageJson.dependencies[moduleName] ||
        cwdPackageJson.devDependencies[moduleName] ||
        currentState.get('globalPackages')[moduleName];

    if (packageJsonVersion && !semver.validRange(packageJsonVersion)) {
        return false;
    }

    spinner.text = `Checking registry for ${moduleName}`;

    const unusedDependencies = currentState.get('unusedDependencies');
    const missingFromPackageJson = currentState.get('missingFromPackageJson');

    function foundIn(files) {
        if (!files) {
            return;
        }

        return 'Found in: ' + files.map(filepath => filepath.replace(currentState.get('cwd'), ''))
            .join(', ')
    }

    return getNpmInfo(moduleName)
        .then(fromRegistry => {
            spinner.text = `Checking registry for ${moduleName} - complete.`;
            spinner.start();

            const installedVersion = modulePackageJson.version;

            const latest = installedVersion && fromRegistry.latest && fromRegistry.next && semver.gt(installedVersion, fromRegistry.latest) ? fromRegistry.next : fromRegistry.latest;
            const versions = fromRegistry.versions || [];

            const versionWanted = semver.maxSatisfying(versions, packageJsonVersion);

            const versionToUse = installedVersion || versionWanted;
            const usingNonSemver = semver.valid(latest) && semver.lt(latest, '1.0.0-pre');

            const bump = semver.valid(latest) &&
                        semver.valid(versionToUse) &&
                        (usingNonSemver && semverDiff(versionToUse, latest) ? 'nonSemver' : semverDiff(versionToUse, latest));

            const unused = _.includes(unusedDependencies, moduleName);

            return {
                // info
                moduleName: moduleName,
                homepage: fromRegistry.homepage,
                regError: fromRegistry.error,
                pkgError: modulePackageJson.error,

                // versions
                latest: latest,
                installed: versionToUse,
                isInstalled: packageIsInstalled,
                notInstalled: !packageIsInstalled,
                packageWanted: versionWanted,
                packageJson: packageJsonVersion,

                // Missing from package json
                notInPackageJson: foundIn(missingFromPackageJson[moduleName]),

                // meta
                devDependency: _.has(cwdPackageJson.devDependencies, moduleName),
                usedInScripts: _.findKey(cwdPackageJson.scripts, script => {
                    return script.indexOf(moduleName) !== -1;
                }),
                mismatch: semver.validRange(packageJsonVersion) &&
                    semver.valid(versionToUse) &&
                    !semver.satisfies(versionToUse, packageJsonVersion),
                semverValid:
                    semver.valid(versionToUse),
                easyUpgrade: semver.validRange(packageJsonVersion) &&
                    semver.valid(versionToUse) &&
                    semver.satisfies(latest, packageJsonVersion) &&
                    bump !== 'major',
                bump: bump,

                unused: unused
            };
        });
}

function processData(currentState) {
    const cwdPackageJson = currentState.get('cwdPackageJson');

    spinner = ora(`Checking the npm registry.`);
    spinner.enabled = currentState.get('spinner');


    function dependencies(pkg) {
        if (currentState.get('global')) {
            return currentState.get('globalPackages');
        }

        if (currentState.get('ignoreDev')) {
            return pkg.dependencies;
        }

        return merge(pkg.dependencies, pkg.devDependencies);
    }

    const missingFromPackageJson = currentState.get('missingFromPackageJson') || {};
    const allDependencies = [].concat.call(Object.keys(dependencies(cwdPackageJson)),
        Object.keys(missingFromPackageJson));

    const npmPromises = allDependencies.map(moduleName => processModule(moduleName, currentState));

    return Promise.all(npmPromises)
        .then(arrayOfPackageInfo => {
            const arrayOfPackageInfoCleaned = arrayOfPackageInfo
                    .filter(Boolean);

            currentState.set('packages', arrayOfPackageInfoCleaned);

            spinner.stop();
            return currentState;
        }).catch(err => {
            spinner.stop();
            throw err;
        });
}

module.exports = processData;
