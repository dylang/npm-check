'use strict';
const _ = require('lodash');
const path = require('path');
const mergeOptions = require('merge-options');
const globalModulesPath = require('global-modules');
const readPackageJson = require('./read-package-json');
const installedModules = require('./installed-modules');

const defaultOptions = {
    update: false,
    global: false,
    path: process.cwd(),
    nodeModulesPath: false,
    skipUnused: false,

    // productionOnly: false,
    ignoreDev: false,
    forceColor: false,
    saveExact: false,
    debug: false,
    noEmoji: false,

    installed: false,
    packageJson: {devDependencies: {}, dependencies: {}}
};

const options = mergeOptions(defaultOptions, {});

function get(key) {
    return options[key];
}

function init(userOptions) {
    _.each(userOptions, (value, key) => set(key, value));

    // I don't love having this here
    if (get('global')) {
        set('path', globalModulesPath);
        set('nodeModulesPath', globalModulesPath);
        set('installed', installedModules())
    } else {
        const userPath = path.resolve(get('path'));
        set('packageJson', readPackageJson(path.join(userPath, 'package.json')));
        set('path', userPath);
        set('nodeModulesPath', path.join(userPath, 'node_modules'));
    }

    if (get('debug')) {
        console.log('options', all());
    }
}

function set(key, value) {
    if (get('debug')) {
        console.log(`[npm-check] set "${key}"`, value);
    }

    if (options.hasOwnProperty(key)) {
        options[key] = value;
    } else {
        throw new Error(`unknown option "${key}" setting to "${value}".`);
    }
}

function all() {
    return options;
}

module.exports = {
    get: get,
    set: set,
    init: init,
    all: all
};
