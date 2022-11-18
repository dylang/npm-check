import co from 'co';
import extend from 'xtend';
import ora from 'ora';
import getUnusedPackages from './get-unused-packages.js';
import createPackageSummary from './create-package-summary.js';

export default function npmCheck(currentState) {
    return co(function * () {
        yield getUnusedPackages(currentState);

        const spinner = ora('Checking npm registries for updated packages.');
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

            return extend(pkg.dependencies, pkg.devDependencies);
        }

        const allDependencies = dependencies(cwdPackageJson);
        const allDependenciesIncludingMissing = Object.keys(extend(allDependencies, currentState.get('missingFromPackageJson')));

        const arrayOfPackageInfo = yield allDependenciesIncludingMissing
            .map(moduleName => createPackageSummary(moduleName, currentState))
            .filter(Boolean);

        currentState.set('packages', arrayOfPackageInfo);

        spinner.stop();
        return currentState;
    });
}
