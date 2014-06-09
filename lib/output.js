'use strict';

var chalk = require('chalk');
var _ = require('lodash');
var table = require('text-table');
var emoji = require('./util/cli-emoji');

function uppercaseFirstLetter(str) {
    return str[0].toUpperCase() + str.substr(1);
}

function render(moduleName, data) {
    var rows = [];

    var status = _([
            !data.installed ? chalk.bgRed.white.bold(' ' + emoji.tired_face + '  MISSING! ') + ' In package.json but not installed.' : '',
            data.bump && data.easy_upgrade ? [
                chalk.bgRed.white.bold(' ' + emoji.poop + '  UPDATE!  ') + ' Your local install is out of date. ',
                '              ' + chalk.green('npm install ' + moduleName) + ' to go from ' + data.installed + ' to ' + data.latest,
            ] : '',
            data.bump && !data.easy_upgrade ? [
                chalk.black.bold.bgYellow(' ' + emoji.sunglasses + '  ' + data.bump.toUpperCase() + ' UP ') + ' ' + uppercaseFirstLetter(data.bump) + ' update available: '  + chalk.blue.underline(data.homepage),
                '              ' + chalk.green('npm install --save' + (data.devDependency ? '-dev' : '')  + ' ' + moduleName + '@' + data.latest) + ' to go from ' + data.installed + ' to ' + data.latest,
            ] : '',
            data.unused ? [chalk.black.bold.bgYellow(' ' + emoji.confused + '  NOTUSED? ') + ' Possibly never referenced in the code.',
                '              ' + chalk.green('npm uninstall --save' + (data.devDependency ? '-dev' : '') + ' ' + moduleName) + ' to remove.'
            ] : '',
            data.mismatch && !data.bump ? chalk.bgRed.yellow.bold(' ' + emoji.interrobang + ' MISMATCH ') + ' Installed version does not match package.json. ' + data.installed + ' ≠ ' + data.packageJson + '' : '',
        ])
        .flatten()
        .compact()
        .valueOf();

    if (!status.length){
        return;
    }

    rows.push(
        [
            chalk.yellow(moduleName),
            status.shift()

        ]);

    while(status.length) {
        rows.push([' ', status.shift()]);
    }

    rows.push(
        [
            ' '
        ]);

    return rows;
}


function outputConsole(modules) {
    //console.log(modules);

    var rows = _(modules).reduce(function(acc, data, moduleName) {
            return acc.concat(render(moduleName, data));
        }, []);

    rows = _(rows)
        .compact()
        .valueOf();

    if (rows.length) {
        var t = table(rows, {
            stringLength: function(s) {
                return chalk.stripColor(s).length;
            }
        });

        console.log('');
        console.log(t);
    } else {
        console.log(emoji.heart + '  Your modules look ' + chalk.bold('amazing') + '. Keep up the great work.' + emoji.heart);
    }
}

module.exports = outputConsole;