'use strict';

var cwd = process.cwd();
var pkgJson = require('../package.json');
var npmCheck = require('./npm-check');
var output = require('./output');
var update = require('./update');

var program = require('commander');
var _ = require('lodash');

process.title = pkgJson.name;

program
    .version(pkgJson.version)
    .usage('[options] <package[@version]>')
    .option('-g, --global', 'Look at global modules')
    .option('-s, --skip-unused', 'Skip check for unused packages.')
    .option('-i, --ignore-dev', 'Ignore dev dependencies.')
    .option('-u, --update', 'Interactive update.')
    .option('-v, --verbose', 'Verbose output')
    .option('-c, --color', 'Force color outut')
    .parse(process.argv);

//console.log('args', Object.keys(program), process.global, !!process.global);

var options = {
    skipUnused: program.skipUnused,
    ignoreDev: program.ignoreDev,
    update: program.update,
    verbose: program.verbose,
    package: process.argv,
    global: program.global,
    path: cwd
};

npmCheck(options)
    .catch(function(err){
        console.log('[npm-check]', err.stack || err);
        process.exit(1);
    })
    .then(options.update ? _.partialRight(update, options) : output)
    .catch(function(err){
        console.log('[npm-check]', err.stack || err);
        process.exit(1);
    })
    .done();
