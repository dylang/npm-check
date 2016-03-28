'use strict';

const chalk = require('chalk');
const _ = require('lodash');
const table = require('text-table');
const emoji = require('./util/emoji');

function uppercaseFirstLetter(str) {
    return str[0].toUpperCase() + str.substr(1);
}

function render(packageName, data) {
    const rows = [];

    // DYLAN: clean this up
    const status = _([
        data.isInstalled ? '' : chalk.bgGreen.white.bold(emoji(' :worried: ') + ' MISSING! ') + ' In package.json but not installed.',
        data.bump && data.easyUpgrade ? [
            chalk.bgGreen.white.bold(emoji(' :heart_eyes: ') + ' UPDATE!  ') + ' Your local install is out of date. ' + chalk.blue.underline(data.homepage),
            '           ' + emoji('   ') + chalk.green('npm install ' + packageName) + ' to go from ' + data.installed + ' to ' + data.latest
        ] : '',
        data.bump && !data.easyUpgrade ? [
            chalk.white.bold.bgRed((data.bump === 'nonSemver' ? emoji(' :sunglasses: ') + ' new ver! '.toUpperCase() : emoji(' :sunglasses: ') + ' ' + data.bump.toUpperCase() + ' UP ')) + ' ' + uppercaseFirstLetter(data.bump) + ' update available: ' + chalk.blue.underline(data.homepage),
            '           ' + emoji('   ') + chalk.green('npm install --save' + (data.devDependency ? '-dev' : '') + ' ' + packageName + '@' + data.latest) + ' to go from ' + data.installed + ' to ' + data.latest
        ] : '',
        data.unused ? [chalk.black.bold.bgWhite(emoji(' :confused: ') + ' NOTUSED? ') + ' Possibly not referenced in the code.',
            '           ' + emoji('   ') + chalk.green('npm uninstall --save' + (data.devDependency ? '-dev' : '') + ' ' + packageName) + ' to remove.'
        ] : '',
        data.mismatch && !data.bump ? chalk.bgRed.yellow.bold(emoji(' :interrobang: ') + ' MISMATCH ') + ' Installed version does not match package.json. ' + data.installed + ' ≠ ' + data.packageJson : '',
        data.error ? chalk.bgRed.white.bold(emoji(' :no_entry:') + '  NPM ERR! ') + ' ' + chalk.red(data.error) : ''
    ])
    .flatten()
    .compact()
    .valueOf();

    if (!status.length) {
        return false;
    }

    rows.push(
        [
            chalk.yellow(packageName),
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

function outputConsole(currentState) {
    const packages = currentState.get('packages');

    if (currentState.get('debug')) {
        console.log('[npm-check debug] modules', packages);
    }

    if (_.isUndefined(packages)) {
        return;
    }

    const rows = _(packages).reduce((acc, data, moduleName) => {
        return acc.concat(render(moduleName, data, currentState));
    }, [])
    .filter(Boolean);

    if (rows.length) {
        var t = table(rows, {
            stringLength: function (s) {
                return chalk.stripColor(s).length;
            }
        });

        console.log('');
        console.log(t);
        console.log('Use ' + chalk.green('npm-check -u' + (currentState.get('global') ? ' -g' : '')) + ' for interactive update.');
        process.exit(-1);
    } else {
        console.log(`${emoji(':heart:  ')}Your modules look ${chalk.bold('amazing')}. Keep up the great work.${emoji(' :heart:')}`);
        process.exit(0);
    }
}

module.exports = outputConsole;
