#!/usr/bin/env node

import meow from 'meow';
import updateNotifier from 'update-notifier';
import isCI from 'is-ci';
import createCallsiteRecord from 'callsite-record';
import { packageDirectorySync } from 'pkg-dir';
import detectPreferredPM from 'preferred-pm';
import pkg from '../package.json' assert { type: 'json' };
import npmCheck from './index.js';
import staticOutput from './out/static-output.js';
import interactiveUpdate from './out/interactive-update.js';
import updateAll from './out/update-all.js';
import debug from './state/debug.js';

updateNotifier({ pkg }).notify();

/* eslint-disable indent */
const cli = meow(
    `
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
    `,
    {
        importMeta: import.meta,
        flags: {
            update: {
                type: 'boolean',
                shortFlag: 'u'
            },
            updateAll: {
                type: 'boolean',
                shortFlag: 'y'
            },
            global: {
                type: 'boolean',
                shortFlag: 'g'
            },
            skipUnused: {
                type: 'boolean',
                shortFlag: 's'
            },
            production: {
                type: 'boolean',
                shortFlag: 'p'
            },
            devOnly: {
                type: 'boolean',
                shortFlag: 'd'
            },
            saveExact: {
                type: 'boolean',
                shortFlag: 'E'
            },
            ignore: {
                type: 'string',
                shortFlag: 'i'
            },
            specials: {
                type: 'string'
            },
            color: {
                type: 'boolean'
            },
            emoji: {
                type: 'boolean',
                default: !isCI
            },
            debug: {
                type: 'boolean'
            },
            spinner: {
                type: 'boolean',
                default: !isCI
            },
            installer: {
                type: 'string',
                shortFlag: 'I',
                default: process.env.NPM_CHECK_INSTALLER || 'auto',
                choices: ['npm', 'pnpm', 'yarn', 'json', 'auto']
            }
        }
    }
);

/* eslint-enable indent */

const options = {
    cwd: cli.input[0] || packageDirectorySync() || process.cwd(),
    update: cli.flags.update,
    updateAll: cli.flags.updateAll,
    global: cli.flags.global,
    skipUnused: cli.flags.skipUnused,
    ignoreDev: cli.flags.production,
    devOnly: cli.flags.devOnly,
    saveExact: cli.flags.saveExact,
    specials: cli.flags.specials,
    emoji: cli.flags.emoji,
    installer: cli.flags.installer,
    debug: cli.flags.debug,
    spinner: cli.flags.spinner,
    ignore: cli.flags.ignore
};

if (options.debug) {
    debug('cli.flags', cli.flags);
    debug('cli.input', cli.input);
}

process.chdir(options.cwd);

Promise.resolve()
    .then(() => {
        return options.installer === 'auto'
            ? detectPreferredInstaller(options.cwd)
            : options.installer;
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
    .catch(error => {
        console.log(error);

        if (options.debug) {
            console.log(createCallsiteRecord(error).renderSync());
        } else {
            console.log('For more detail, add `--debug` to the command');
        }

        process.exit(1);
    });

const SUPPORTED_INSTALLERS = new Set(['npm', 'pnpm', 'ied', 'yarn']);

async function detectPreferredInstaller(cwd) {
    const preferredPM = await detectPreferredPM(cwd);
    return preferredPM && SUPPORTED_INSTALLERS.has(preferredPM.name)
        ? preferredPM.name
        : 'npm';
}
