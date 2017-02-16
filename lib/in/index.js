'use strict';
const co = require('co');
const merge = require('merge-options');
const ora = require('ora');
const getUnusedPackages = require('./get-unused-packages');
const createPackageSummary = require('./create-package-summary');

module.exports = function (currentState) {
    return co(function *() {
        yield getUnusedPackages(currentState);

        const spinner = ora(`Checking npm registries for updated packages.`);
        spinner.enabled = spinner.enabled && currentState.get('spinner');
        spinner.start();

        const cwdPackageJson = currentState.get('cwdPackageJson');

        function dependencies(pkg) {
            if (currentState.get('global')) {
                return currentState.get('globalPackages');
            }

            if (currentState.get('ignoreDev')) {
                return pkg.dependencies;
            }

            if (currentState.get('devOnly')) {
                return pkg.devDependencies;
            }

            return merge(pkg.dependencies, pkg.devDependencies);
        }

        const allDependencies = dependencies(cwdPackageJson);
        const allDependenciesIncludingMissing = Object.keys(merge(allDependencies, currentState.get('missingFromPackageJson')));

        const arrayOfPackageInfo = yield allDependenciesIncludingMissing
            .map(moduleName => createPackageSummary(moduleName, currentState))
            .filter(Boolean);

        currentState.set('packages', arrayOfPackageInfo);

        spinner.stop();
        return currentState;
    });
};
