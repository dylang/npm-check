

import co from 'co';
import merge from 'merge-options';
import ora from 'ora';
import getUnusedPackages from './get-unused-packages';
import createPackageSummary from './create-package-summary';

export default function (currentState) {
  return co(function* () {
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
