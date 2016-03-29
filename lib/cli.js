'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const npmCheck = require('./index');
const output = require('./output');
const update = require('./update');
const debug = require('./util/debug');

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
          -E, --save-exact      Save exact version (x.y.z) instead of caret (^x.y.z) in package.json.
          --no-color            Force or disable color output.
          --no-emoji            Remove emoji support. Necessary for some terminals and CI environments.
          --debug               Debug output. Throw in a gist when creating issues on github.

        Examples
          $ npm-check           # See what can be updated, what isn't being used.
          $ npm-check ../foo    # Check another path.
          $ npm-check -g -u     # Update globally installed modules by picking which ones to upgrade.
    `},
    {
        alias: {
            u: 'update',
            g: 'global',
            s: 'skip-unused',
            p: 'production',
            E: 'save-exact'
        },
        default: {
            dir: process.cwd(),
            emoji: true
        },
        boolean: [
            'update',
            'global',
            'skip-unused',
            'production',
            'save-exact',
            'color',
            'emoji'
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
    debug: cli.flags.debug
};

if (options.debug) {
    debug('cli.flags', cli.flags);
    debug('cli.input', cli.input);
}

npmCheck(options)
    .then(currentState => {
        currentState.inspectIfDebugMode();

        if (options.update) {
            return update(currentState);
        }

        return output(currentState);
    })
    .catch(err => {
        console.log(err.message);
        if (options.debug) {
            console.log(err.stack);
        }
        process.exit(-1);
    });
