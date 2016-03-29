'use strict';

const _ = require('lodash');
const inquirer = require('inquirer');
const chalk = require('chalk');
const spawnNpm = require('./npm/spawn-npm');
const emoji = require('./util/emoji');
const table = require('text-table');

function label(pkg) {
    const bumpInstalled = pkg.bump ? pkg.installed : '';
    const installed = pkg.mismatch ? pkg.packageJson : bumpInstalled;
    const name = chalk.yellow(pkg.moduleName);
    const type = pkg.devDependency ? chalk.green(' devDep') : '';
    const missing = pkg.notInstalled ? chalk.red(' missing') : '';
    const homepage = pkg.homepage ? chalk.blue.underline(pkg.homepage) : '';
    return [
        name + type + missing,
        installed,
        installed && '❯',
        chalk.bold(pkg.latest || ''),
        pkg.latest ? homepage : pkg.regError || pkg.pkgError
    ];
}

function choice(pkg) {
    if (!pkg.mismatch && !pkg.bump && !pkg.notInstalled) {
        return false;
    }

    return {
        value: pkg.moduleName + '@' + pkg.latest,
        name: label(pkg),
        checked: pkg.mismatch ||
            (Boolean(pkg.easyUpgrade || pkg.notInstalled) && Boolean(pkg.bump !== 'nonSemver' && pkg.latest))
    };
}

function unselectable(options) {
    return new inquirer.Separator(chalk.reset(options ? options.title : ' '));
}

function createChoices(packages, options) {
    const choices = _(packages)
        .filter(options.filter)
        .map(choice)
        .compact()
        .valueOf();

    const choicesAsATable = table(_.map(choices, 'name'), {
        align: ['l', 'l', 'l'],
        stringLength: function (str) {
            return chalk.stripColor(str).length;
        }
    }).split('\n');

    const choicesWithTableFormating = _.map(choices, function (choice, i) {
        choice.name = choicesAsATable[i];
        return choice;
    });

    if (choicesWithTableFormating.length) {
        choices.unshift(unselectable(options));
        choices.unshift(unselectable());
        return choices;
    }
}

function interactive(currentState) {
    return new Promise((resolve) => {
        const packages = currentState.get('packages');

        if (currentState.get('debug')) {
            console.log('packages', packages);
        }

        if (_.isUndefined(packages)) {
            return resolve();
        }

        const UI_GROUPS = [
            {
                title: chalk.bold.underline.green('Update package.json to match version installed.'),
                filter: {mismatch: true, bump: null}
            },
            {
                title: `${chalk.bold.underline.green('Missing.')} ${chalk.green('You probably want these.')}`,
                filter: {notInstalled: true, bump: null}
            },
            {
                title: chalk.bold.underline.green('Patch Update') + chalk.green(' Backwards-compatible bug fixes.'),
                filter: {bump: 'patch'}
            },
            {
                title: chalk.yellow.underline.bold('Minor Update') + chalk.yellow(' New backwards-compatible features.'),
                bgColor: 'yellow',
                filter: {bump: 'minor'}
            },
            {
                title: chalk.red.underline.bold('Major Update') + chalk.red(' Potentially breaking API changes. Use caution.'),
                filter: {bump: 'major'}
            },
            {
                title: chalk.magenta.underline.bold('Non-Semver') + chalk.magenta(' Versions less than 1.0.0, caution.'),
                filter: {bump: 'nonSemver'}
            }
        ];

        const choices = _(UI_GROUPS)
            .map(_.curry(createChoices)(packages))
            .flatten()
            .compact()
            .valueOf();

        if (!choices.length) {
            console.log(`${emoji(':heart:  ')}Your modules look ${chalk.bold('amazing')}. Keep up the great work.${emoji(' :heart:')}`);
            return;
        }

        choices.push(unselectable());
        choices.push(unselectable({title: 'Space to select. Enter to start upgrading. Control-C to cancel.'}));

        const questions = [
            {
                name: 'packages',
                message: 'Choose which packages to update.',
                type: 'checkbox',
                choices: choices.concat(unselectable()),
                pageSize: process.stdout.rows - 2
            }
        ];

        return new Promise(resolve => inquirer.prompt(questions, resolve)).then(answers => {
            const packagesToUpdate = answers.packages;

            if (!packagesToUpdate || !packagesToUpdate.length) {
                console.log('No packages selected for updated.');
                return false;
            }

            const saveDevDependencies = _(packagesToUpdate)
                .filter(function (pkgVersion) {
                    var pkgArray = pkgVersion.split('@');
                    pkgArray.pop();
                    var pkgName = pkgArray.join('@');
                    return packages[pkgName].devDependency;
                })
                .valueOf();

            if (saveDevDependencies.length && !currentState.get('global')) {
                saveDevDependencies.unshift('--save-dev');
            }

            const saveDependencies = _(packagesToUpdate)
                .difference(saveDevDependencies)
                .valueOf();

            if (saveDependencies.length && !currentState.get('global')) {
                saveDependencies.unshift('--save');
            }

            return spawnNpm.install(saveDependencies, currentState)
                .then((currentState) => spawnNpm.install(saveDevDependencies, currentState))
                .then((currentState) => {
                    console.log('');
                    console.log('[npm-check] ' + chalk.green('Update complete!'), packagesToUpdate.join(', '));
                    console.log('[npm-check] You should re-run your tests to make sure everything works with the updates.');
                    return currentState;
                });
        });
    });
}

module.exports = interactive;
