'use strict';

var cwd = process.cwd();
var pkgJson = require('../package.json');
var npmCheck = require('./npm-check');
var output = require('./output');
var interactive = require('./interactive');

var program = require('commander');

process.title = pkgJson.name;

program
    .version(pkgJson.version)
    .usage('[options] <package[@version]>')
    .option('-s, --skip-unused', 'Skip check for unused packages.')
    .option('-i, --ignore-dev', 'Ignore dev dependencies.')
    .option('-u, --update', 'Interactive update.')
    .option('-v, --verbose', 'Verbose output')
    .option('-c, --color', 'Force color outut')
    .parse(process.argv);

//console.log('args', program.args);

var options = {
    skipUnused: program.skipUnused,
    ignoreDev: program.ignoreDev,
    update: program.update,
    verbose: program.verbose,
    package: process.argv,
    path: cwd
};

npmCheck(options)
    .then(options.update ? interactive : output)
    .catch(function(err){
        console.log('[npm-check]', err.stack || err);
        process.exit(1);
    })
    .done();
