'use strict';

var chalk = require('chalk');
var _ = require('lodash');
var table = require('text-table');
var emoji = require('node-emoji');

function uppercaseFirstLetter(str) {
    return str[0].toUpperCase() + str.substr(1);
}

function render(moduleName, data) {
    var rows = [];

    var status = _([
        !data.isInstalled ? chalk.bgGreen.white.bold(' ' + emoji.get('worried') + '  MISSING! ') + ' In package.json but not installed.' : '',
        data.bump && data.easyUpgrade ? [
            chalk.bgGreen.white.bold(' ' + emoji.get('heart_eyes') + '  UPDATE!  ') + ' Your local install is out of date. ' + chalk.blue.underline(data.homepage),
            '              ' + chalk.green('npm install ' + moduleName) + ' to go from ' + data.installed + ' to ' + data.latest
        ] : '',
        data.bump && !data.easyUpgrade ? [
            chalk.white.bold.bgRed(' ' + (data.bump === 'nonSemver' ? emoji.get('sunglasses') + '  new ver! '.toUpperCase() : emoji.get('sunglasses') + '  ' + data.bump.toUpperCase() + ' UP ')) + ' ' + uppercaseFirstLetter(data.bump) + ' update available: ' + chalk.blue.underline(data.homepage),
            '              ' + chalk.green('npm install --save' + (data.devDependency ? '-dev' : '') + ' ' + moduleName + '@' + data.latest) + ' to go from ' + data.installed + ' to ' + data.latest
        ] : '',
        data.unused ? [chalk.black.bold.bgWhite(' ' + emoji.get('confused') + '  NOTUSED? ') + ' Possibly never referenced in the code.',
            '              ' + chalk.green('npm uninstall --save' + (data.devDependency ? '-dev' : '') + ' ' + moduleName) + ' to remove.'
        ] : '',
        data.mismatch && !data.bump ? chalk.bgRed.yellow.bold(' ' + emoji.get('interrobang') + '  MISMATCH ') + ' Installed version does not match package.json. ' + data.installed + ' ≠ ' + data.packageJson : '',
        data.error ? chalk.bgRed.white.bold(' ' + emoji.get('no_entry') + '  NPM ERR! ') + ' ' + chalk.red(data.error) : ''
    ])
    .flatten()
    .compact()
    .valueOf();

    if (!status.length) {
        return false;
    }

    rows.push(
        [
            chalk.yellow(moduleName),
            status.shift()

        ]);

    while (status.length) {
        rows.push([' ', status.shift()]);
    }

    rows.push(
        [
            ' '
        ]);

    return rows;
}

function outputConsole(modules, options) {
    if (options.debug) {
        console.log(modules);
    }

    var rows = _(modules).reduce(function (acc, data, moduleName) {
        return acc.concat(render(moduleName, data));
    }, []);

    rows = _(rows)
        .compact()
        .valueOf();

    if (rows.length) {
        var t = table(rows, {
            stringLength: function (s) {
                return chalk.stripColor(s).length;
            }
        });

        console.log('');
        console.log(t);
        console.log('Use ' + chalk.green('npm-check -u' + (options.global ? ' -g' : '')) + ' for interactive update.');
    } else {
        console.log(emoji.get('heart') + '  Your modules look ' + chalk.bold('amazing') + '. Keep up the great work.' + emoji.get('heart'));
    }
}

module.exports = outputConsole;
