'use strict';

var _ = require('lodash');

var inquirer = require('inquirer');
var chalk = require('chalk');
var spawnNpm = require('./npm/spawn-npm');
var emoji = require('./util/cli-emoji');
var table = require('text-table');


function label(pkg){
    var installed =  pkg.bump ? pkg.installed : '';

    var name = chalk.yellow(pkg.moduleName);
    //var versions = ;
    var type = pkg.devDependency ? chalk.green(' devDep') : '';
    var missing =  pkg.notInstalled ? chalk.red(' missing') : '';
    var homepage = pkg.homepage ? chalk.blue.underline(pkg.homepage) : '';
    return [
        name + type + missing,
        installed,
        installed && '❯',
        chalk.bold(pkg.latest || ''),
        pkg.latest ? homepage : pkg.error];

}

function choice(pkg){
    if (!pkg.bump && !pkg.notInstalled) {
        return;
    }

    return {
        value: pkg.moduleName + '@' + pkg.latest,
        name: label(pkg),
        checked: !!(pkg.easy_upgrade || pkg.notInstalled) && !!(pkg.bump !== 'nonSemver' && pkg.latest)
    };
}

function unselectable(options) {
    return new inquirer.Separator(chalk[options && options.bgColor || 'bgBlack'].black(options && options.title ?
    ' --------------------- ' + options.title : '--'));
}

function createChoices(packages, options) {
    var choices = _(packages)
        .filter(options.filter)
        .map(choice)
        .compact()
        .valueOf();

    var choicesAsATable = table(_.pluck(choices, 'name'), {
        align: ['l', 'l', 'l'],
        stringLength: function(str) { return chalk.stripColor(str).length; }
    }).split('\n');

    var choicesWithTableFormating = _.map(choices, function(choice, i){
        choice.name = choicesAsATable[i];
        return choice;
    });

    if (choicesWithTableFormating.length) {
        choices.unshift(unselectable(options));
        choices.unshift(unselectable());
        return choices;
    }
}

function interactive(packages, options) {

    if (options.debug) {
        console.log(packages);
    }


    var UI_GROUPS = [
        {
            title: 'Missing :: You might want to install these ------------------------------ ',
            bgColor: 'bgGreen',
            filter: { notInstalled: true, bump: null}
        },
        {
            title: 'Patch Update :: Backwards-compatible bug fixes -------------------------- ',
            bgColor: 'bgGreen',
            filter: { bump: 'patch' }
        },
        {
            title: 'Minor Update :: New backwards-compatible features ----------------------- ',
            bgColor: 'bgYellow',
            filter: { bump: 'minor' }
        },
        {
            title: 'Major Update :: Potentially breaking API changes, caution! -------------- ',
            bgColor: 'bgRed',
            filter: { bump: 'major' }
        },
        {
            title: 'Non-Semver :: Versions less than 1.0.0 ---------------------------------- ',
            bgColor: 'bgMagenta',
            filter: { bump: 'nonSemver'}
        }
    ];

    var choices = _(UI_GROUPS)
        .map(_.curry(createChoices)(packages))
        .flatten()
        .compact()
        .valueOf();

    if (!choices.length) {
        console.log(emoji.heart + '  Your modules look ' + chalk.bold('amazing') + '. Keep up the great work.' + emoji.heart);
        return;
    }

    var questions = [
        {
            name: 'packages',
            message: 'choose',
            type: "checkbox",
            choices: choices.concat(unselectable())
        }
    ];

    inquirer.prompt(questions, function(answers) {

        var packagesToUpdate = answers.packages;

        if (!packagesToUpdate || !packagesToUpdate.length) {
            console.log('No packages selected for updated.');
            return;
        }

        var saveDevDependencies = _(packagesToUpdate)
            .filter(function(pkgVersion) {
                var pkg = pkgVersion.split('@')[0];
                return packages[pkg].devDependency;
            })
            .valueOf();

        if (saveDevDependencies.length && !options.global) {
            saveDevDependencies.unshift('--save-dev');
        }

        var saveDependencies = _(packagesToUpdate)
            .difference(saveDevDependencies)
            .valueOf();

        if (saveDependencies.length && !options.global) {
            saveDependencies.unshift('--save');
        }

        return spawnNpm.install(saveDependencies, options)
            .then(_.partial(spawnNpm.install, saveDevDependencies, options))
            .then(function(){
                console.log('Update complete! You should run your tests to make sure everything works with the updates.');
            });
    });
}

module.exports = interactive;