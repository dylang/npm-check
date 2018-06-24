#!/usr/bin/env node
'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const isCI = require('is-ci');
const createCallsiteRecord = require('callsite-record');
const pkg = require('../package.json');
const npmCheck = require('./index');
const staticOutput = require('./out/static-output');
const interactiveUpdate = require('./out/interactive-update');
const updateAll = require('./out/update-all');
const debug = require('./state/debug');
const pkgDir = require('pkg-dir');
const detectPreferredPM = require('preferred-pm');

updateNotifier({pkg}).notify();

const cli = meow({
    help: `
        Usage
          $ npm-check <path> <options>

        Path
          Where to check. Defaults to current directory. Use -g for checking global modules.

        Options
          -u, --update          Interactive update.
          -y, --update-all      Uninteractive update. Apply all updates without prompting.
          -g, --global          Look at global modules.
          -s, --skip-unused     Skip check for unused packages.
          -p, --production      Skip devDependencies.
          -d, --dev-only        Look at devDependencies only (skip dependencies).
          -i, --ignore          Ignore dependencies based on succeeding glob.
          -E, --save-exact      Save exact version (x.y.z) instead of caret (^x.y.z) in package.json.
          --specials            List of depcheck specials to include in check for unused dependencies.
          --no-color            Force or disable color output.
          --no-emoji            Remove emoji support. No emoji in default in CI environments.
          --debug               Debug output. Throw in a gist when creating issues on github.

        Examples
          $ npm-check           # See what can be updated, what isn't being used.
          $ npm-check ../foo    # Check another path.
          $ npm-check -gu       # Update globally installed modules by picking which ones to upgrade.
    `},
    {
        alias: {
            u: 'update',
            y: 'update-all',
            g: 'global',
            s: 'skip-unused',
            p: 'production',
            d: 'dev-only',
            E: 'save-exact',
            i: 'ignore'
        },
        default: {
            dir: pkgDir.sync() || process.cwd(),
            emoji: !isCI,
            spinner: !isCI
        },
        boolean: [
            'update',
            'update-all',
            'global',
            'skip-unused',
            'production',
            'dev-only',
            'save-exact',
            'color',
            'emoji',
            'spinner'
        ],
        string: [
            'ignore',
            'specials'
        ]
    });

const options = {
    cwd: cli.input[0] || cli.flags.dir,
    update: cli.flags.update,
    updateAll: cli.flags.updateAll,
    global: cli.flags.global,
    skipUnused: cli.flags.skipUnused,
    ignoreDev: cli.flags.production,
    devOnly: cli.flags.devOnly,
    saveExact: cli.flags.saveExact,
    specials: cli.flags.specials,
    emoji: cli.flags.emoji,
    installer: process.env.NPM_CHECK_INSTALLER || 'auto',
    debug: cli.flags.debug,
    spinner: cli.flags.spinner,
    ignore: cli.flags.ignore
};

if (options.debug) {
    debug('cli.flags', cli.flags);
    debug('cli.input', cli.input);
}

Promise.resolve()
    .then(() => {
        return options.installer === 'auto' ?
            detectPreferredInstaller(options.cwd) :
            options.installer;
    })
    .then(installer => {
        options.installer = installer;
        return npmCheck(options);
    })
    .then(currentState => {
        currentState.inspectIfDebugMode();

        if (options.updateAll) {
            return updateAll(currentState);
        }
        if (options.update) {
            return interactiveUpdate(currentState);
        }

        return staticOutput(currentState);
    })
    .catch(err => {
        console.log(err.message);
        if (options.debug) {
            console.log(createCallsiteRecord(err).renderSync());
        } else {
            console.log('For more detail, add `--debug` to the command');
        }
        process.exit(1);
    });

var SUPPORTED_INSTALLERS = ['npm', 'pnpm', 'ied'];

function detectPreferredInstaller(cwd) {
    return detectPreferredPM(cwd)
        .then(preferredPM => {
            return preferredPM && SUPPORTED_INSTALLERS.indexOf(preferredPM.name) !== -1 ?
                preferredPM.name : 'npm';
        });
}
