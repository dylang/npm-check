'use strict';

const Module = require('module');
const path = require('path');
const pathExists = require('path-exists');

/**
 * Searches the directory hierarchy to return the path to the requested node module.
 * If the module can't be found, returns the initial (deepest) tried path.
 */
function findModulePath(moduleName, currentState) {
    const cwd = currentState.get('cwd');

    if (currentState.get('global')) {
        return path.join(cwd, moduleName);
    }

    // Module._nodeModulePaths does not include some places the node module resolver searches, such as
    // the global prefix or other special directories. This is desirable because if a module is missing
    // in the project directory we want to be sure to report it as missing.
    // We can't use require.resolve because it fails if the module doesn't have an entry point.
    const nodeModulesPaths = Module._nodeModulePaths(cwd);
    const possibleModulePaths = nodeModulesPaths.map(x => path.join(x, moduleName));
    const modulePath = possibleModulePaths.find(pathExists.sync);

    // if no existing path was found, return the first tried path anyway
    return modulePath || path.join(cwd, moduleName);
}

module.exports = findModulePath;
