'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const npmCheck = require('./index');
const output = require('./output');
const update = require('./update');

updateNotifier({pkg}).notify();

const cli = meow(`
    Usage
      $ npm-check <Options>

    Options
      -u, --update          Interactive update.
      -g, --global          Look at global modules.
      -s, --skip-unused     Skip check for unused packages.
      -p, --production      Ignore devDependencies.
      -d, --dir [path]      Directory to check, default is current directory.
      -c, --color           Force color output.
      -E, --save-exact      Save exact version instead of ^version.
      --debug               Debug output.

    Examples
      $ npm-check -g -u     # interactive update global deps
`, {
    alias: {
        u: 'update',
        g: 'global',
        s: 'skip-unused',
        p: 'production',
        d: 'dir',
        c: 'color',
        E: 'save-exact'
    }
});

const options = {
    update: cli.flags.update,
    global: cli.flags.global,
    skipUnused: cli.flags.skipUnused,
    ignoreDev: cli.flags.production,
    debug: cli.flags.debug,
    saveExact: cli.flags.saveExact,
    path: cli.flags.dir || process.cwd()
};

npmCheck(options)
    .then(results => options.update ? update(results) : output(results))
    .catch(err => {
        console.log('[npm-check]', err.stack || err);
        process.exit(1);
    });
