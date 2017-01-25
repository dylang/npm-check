

import mergeOptions from 'merge-options';
import init from './init';
import debug from './debug';

const defaultOptions = {
  update: false,
  global: false,
  cwd: process.cwd(),
  nodeModulesPath: false,
  skipUnused: false,

  ignoreDev: false,
  forceColor: false,
  saveExact: false,
  debug: false,
  emoji: true,
  spinner: false,
  installer: 'npm',
  ignore: [],

  globalPackages: {},
  cwdPackageJson: { devDependencies: {}, dependencies: {} },

  packages: false,
  unusedDependencies: false,
  missingFromPackageJson: {},
};

function state(userOptions) {
  const currentStateObject = mergeOptions(defaultOptions, {});

  function get(key) {
    if (!currentStateObject.hasOwnProperty(key)) {
      throw new Error(`Can't get unknown option "${key}".`);
    }
    return currentStateObject[key];
  }

  function set(key, value) {
    if (get('debug')) {
      debug('set key', key, 'to value', value);
    }

    if (currentStateObject.hasOwnProperty(key)) {
      currentStateObject[key] = value;
    } else {
      throw new Error(`unknown option "${key}" setting to "${JSON.stringify(value, false, 4)}".`);
    }
  }

  function inspectIfDebugMode() {
    if (get('debug')) {
      inspect();
    }
  }

  function inspect() {
    debug('current state', all());
  }

  function all() {
    return currentStateObject;
  }

  const currentState = {
    get,
    set,
    all,
    inspectIfDebugMode,
  };

  return init(currentState, userOptions);
}
export default state;
