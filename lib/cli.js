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
const debug = require('./state/debug');
const pkgDir = require('pkg-dir');

updateNotifier({pkg}).notify();

const cli = meow({
    help: `
        Usage
          $ npm-check <path> <options>

        Path
          Where to check. Defaults to current directory. Use -g for checking global modules.

        Options
          -u, --update          Interactive update.
          -g, --global          Look at global modules.
          -s, --skip-unused     Skip check for unused packages.
          -p, --production      Skip devDependencies.
          -i, --ignore          Ignore dependencies based on succeeding glob.
          -E, --save-exact      Save exact version (x.y.z) instead of caret (^x.y.z) in package.json.
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
            g: 'global',
            s: 'skip-unused',
            p: 'production',
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
            'global',
            'skip-unused',
            'production',
            'save-exact',
            'color',
            'emoji',
            'spinner'
        ],
        string: [
            'ignore'
        ]
    });

const options = {
    cwd: cli.input[0] || cli.flags.dir,
    update: cli.flags.update,
    global: cli.flags.global,
    skipUnused: cli.flags.skipUnused,
    ignoreDev: cli.flags.production,
    saveExact: cli.flags.saveExact,
    emoji: cli.flags.emoji,
    installer: process.env.NPM_CHECK_INSTALLER || 'npm',
    debug: cli.flags.debug,
    spinner: cli.flags.spinner,
    ignore: cli.flags.ignore
};

if (options.debug) {
    debug('cli.flags', cli.flags);
    debug('cli.input', cli.input);
}

npmCheck(options)
    .then(currentState => {
        currentState.inspectIfDebugMode();

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
