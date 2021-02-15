'use strict';

const chalk = require('chalk');
const _ = require('lodash');
const table = require('text-table');
const emoji = require('./emoji');
const stripAnsi = require('strip-ansi');

function uppercaseFirstLetter(str) {
    return str[0].toUpperCase() + str.substr(1);
}

function render(pkg, currentState) {
    const packageName = pkg.moduleName;
    const rows = [];

    const indent = '           ' + emoji('   ');

    const installer = currentState.get('installer');
    const isYarn = installer === 'yarn';

    const args = [isYarn ? 'add' : 'install'];
    if (currentState.get('global')) {
        isYarn ? args.unshift('global') : args.push('--global');
    }

    const flags = [];
    if (isYarn) {
        pkg.devDependency && flags.push('--dev');
    } else {
        pkg.devDependency ? flags.push('--save-dev') : flags.push('--save');
    }

    const upgradeCommand = `${installer} ${args.join(' ')} ${packageName}@${pkg.latest} ${flags.join(' ')}`;
    const upgradeMessage = `${chalk.green(upgradeCommand)} to go from ${pkg.installed} to ${pkg.latest}`;
    // DYLAN: clean this up
    const status = _([
        pkg.notInstalled ? chalk.bgRed.white.bold(emoji(' :worried: ') + ' MISSING! ') + ' Not installed.' : '',
        pkg.notInPackageJson ? chalk.bgRed.white.bold(emoji(' :worried: ') + ' PKG ERR! ') + ' Not in the package.json. ' + pkg.notInPackageJson : '',
        pkg.pkgError && !pkg.notInstalled ? chalk.bgGreen.white.bold(emoji(' :worried: ') + ' PKG ERR! ') + ' ' + chalk.red(pkg.pkgError.message) : '',
        pkg.bump && pkg.easyUpgrade ? [
            chalk.bgGreen.white.bold(emoji(' :heart_eyes: ') + ' UPDATE!  ') + ' Your local install is out of date. ' + chalk.blue.underline(pkg.homepage || ''),
            indent + upgradeMessage
        ] : '',
        pkg.bump && !pkg.easyUpgrade ? [
            chalk.white.bold.bgGreen((pkg.bump === 'nonSemver' ? emoji(' :sunglasses: ') + ' new ver! '.toUpperCase() : emoji(' :sunglasses: ') + ' ' + pkg.bump.toUpperCase() + ' UP ')) + ' ' + uppercaseFirstLetter(pkg.bump) + ' update available. ' + chalk.blue.underline(pkg.homepage || ''),
            indent + upgradeMessage
        ] : '',
        pkg.unused ? [
            chalk.black.bold.bgWhite(emoji(' :confused: ') + ' NOTUSED? ') + ` ${chalk.yellow(`Still using ${packageName}?`)}`,
            indent + `Depcheck did not find code similar to ${chalk.green(`require('${packageName}')`)} or ${chalk.green(`import from '${packageName}'`)}.`,
            indent + `Check your code before removing as depcheck isn't able to foresee all ways dependencies can be used.`,
            indent + `Use rc file options to remove unused check, but still monitor for outdated version:`,
            indent + `    .npmcheckrc {"depcheck": {"ignoreMatches": ["${packageName}"]}}`,
            indent + `Use ${chalk.green('--skip-unused')} to skip this check.`,
            indent + `To remove this package: ${chalk.green(
                isYarn
                    ? `yarn remove ${packageName} ${pkg.devDependency ? '--dev' : ''}`
                    : `npm uninstall ${packageName} --save${pkg.devDependency ? '-dev' : ''}`
            )}`
        ] : '',
        pkg.mismatch && !pkg.bump ? chalk.bgRed.yellow.bold(emoji(' :interrobang: ') + ' MISMATCH ') + ' Installed version does not match package.json. ' + pkg.installed + ' ≠ ' + pkg.packageJson : '',
        pkg.regError ? chalk.bgRed.white.bold(emoji(' :no_entry: ') + ' NPM ERR! ') + ' ' + chalk.red(pkg.regError) : ''
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
        rows.push([
            ' ',
            status.shift()
        ]);
    }

    rows.push(
        [
            ' '
        ]);

    return rows;
}

function outputConsole(currentState) {
    const packages = currentState.get('packages');

    const rows = packages.reduce((acc, pkg) => {
        return acc.concat(render(pkg, currentState));
    }, [])
    .filter(Boolean);

    if (rows.length) {
        const renderedTable = table(rows, {
            stringLength: s => stripAnsi(s).length
        });

        console.log('');
        console.log(renderedTable);
        console.log(`Use ${chalk.green(`npm-check -${currentState.get('global') ? 'g' : ''}u`)} for interactive update.`);
        process.exitCode = 1;
    } else {
        console.log(`${emoji(':heart:  ')}Your modules look ${chalk.bold('amazing')}. Keep up the great work.${emoji(' :heart:')}`);
        process.exitCode = 0;
    }
}

module.exports = outputConsole;
