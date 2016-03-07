'use strict';

var pkgJson = require('../package.json');
var npmCheck = require('./index');
var output = require('./output');
var update = require('./update');
var program = require('commander');
var _ = require('lodash');
var updateNotifier = require('update-notifier');

updateNotifier({pkg: pkgJson}).notify();

process.title = pkgJson.name;

program
    .version(pkgJson.version)
    .usage('[options]')
    .option('-u, --update', 'Interactive update.')
    .option('-g, --global', 'Look at global modules.')
    .option('-s, --skip-unused', 'Skip check for unused packages.')
    .option('-p, --production', 'Ignore devDependencies.')
    .option('-d, --dir [path]', 'Directory to check, default is current directory.')
    .option('-c, --color', 'Force color output.')
    .option('-E, --save-exact', 'Save exact versions')
    .option('--debug', 'Debug output.')
    .parse(process.argv);

var options = {
    update: program.update,
    global: program.global,
    skipUnused: program.skipUnused,
    ignoreDev: program.production,
    debug: program.debug,
    saveExact: program.saveExact,
    path: program.dir || process.cwd()
};

npmCheck(options)
    .catch(function (err) {
        console.log('[npm-check]', err.stack || err);
        process.exit(1);
    })
    .then(_.partialRight(options.update ? update : output, options))
    .catch(function (err) {
        console.log('[npm-check]', err.stack || err);
        process.exit(1);
    })
    .done();
