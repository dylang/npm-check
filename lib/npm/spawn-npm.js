'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var q = require('q');
var bufferedSpawn = require('buffered-spawn');

function spawnNpm(command, args, options) {
    var globalOption = options.global ? '-g' : null;
    var colorOption = chalk.supportsColor ? '--color=always' : null;

    if (!command || !args || !args.length || !options) {
        return q.resolve();
    }

    var npmArgs = _([command])
        .concat(globalOption)
        .concat(colorOption)
        .concat(args)
        .compact()
        .valueOf();

    console.log('Running ' + chalk.green('npm ' + npmArgs.join(' ')));

    return bufferedSpawn('npm', npmArgs)
        .progress(function (buff) {
            process.stdout.write(buff.toString());
        });
}

function install(packages, options) {
    return spawnNpm('install', packages, options);
}

module.exports = {
    install: install
};
