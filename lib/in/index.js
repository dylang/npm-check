'use strict';

const getPackageSummary = require('./get-package-summary');
const merge = require('merge-options');
const ora = require('ora');
const getUnusedPackages = require('./get-unused-packages');

function processData(currentState) {
    return getUnusedPackages(currentState).then(currentState => {
        const spinner = ora(`Checking npm registries for updated packages.`);
        spinner.enabled = currentState.get('spinner');
        spinner.start();

        const cwdPackageJson = currentState.get('cwdPackageJson');

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

        const npmPromises = allDependencies.map(moduleName => getPackageSummary(moduleName, currentState));

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
    });
}

module.exports = processData;
