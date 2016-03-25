'use strict';
const _ = require('lodash');
const path = require('path');
const mergeOptions = require('merge-options');
const globalModulesPath = require('global-modules');
const readPackageJson = require('./read-package-json');
const globalPackages = require('./global-packages');
const emoji = require('./emoji');
const debug = require('./debug');

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

    globalPackages: {},
    cwdPackageJson: {devDependencies: {}, dependencies: {}},

    packages: false,
    unusedDependencies: false
};

function state(userOptions) {
    const currentStateObject = mergeOptions(defaultOptions, {});

    function init(userOptions) {
        _.each(userOptions, (value, key) => set(key, value));

        // I don't love having this here
        if (get('global')) {
            set('cwd', globalModulesPath);
            set('nodeModulesPath', globalModulesPath);
            set('globalPackages', globalPackages(globalModulesPath));
        } else {
            const cwd = path.resolve(get('cwd'));
            const pkg = readPackageJson(path.join(cwd, 'package.json'));
            set('cwdPackageJson', pkg);
            set('cwd', cwd);
            set('nodeModulesPath', path.join(cwd, 'node_modules'));
        }

        emoji.enabled(get('emoji'));
    }

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
            throw new Error(`unknown option "${key}" setting to "${value}".`);
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

    init(userOptions);

    return {
        get: get,
        set: set,
        all,
        inspectIfDebugMode
    };
}
module.exports = state;
