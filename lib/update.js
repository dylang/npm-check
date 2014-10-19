'use strict';

var _ = require('lodash');

var inquirer = require('inquirer');
var chalk = require('chalk');
var buffspawn = require('buffered-spawn');
var emoji = require('./util/cli-emoji');

function spacer(str, minLength) {
    var extraSpace = minLength - chalk.stripColor(str).length;
    return extraSpace > 0 ? new Array(extraSpace).join(' ') : '';
}

function label(pkg){
    var name = pkg.moduleName + ' '  + spacer(pkg.moduleName, 20);
    var versions = spacer(pkg.installed, 7) + chalk.blue(pkg.installed) + ' to ' + spacer(pkg.latest, 7) + chalk.blue(pkg.latest);
    var type = pkg.devDependency ? ' devDep ' : '        '
    var homepage = spacer(name + versions + type, 40) + ' ' + pkg.homepage;

    return name + versions + type + homepage;

}

function choice(pkg, i, data, options){
    //console.log('choice', i, options);

    if (!pkg.bump) {
        return;
    }
    return {
        checked: options && options.checked,
        value: pkg.moduleName + '@' + pkg.latest,
        name: label(pkg)
    };
}

function unselectable(options) {
    return new inquirer.Separator(chalk[options && options.bgColor || 'bgBlack'].black(options && options.title ?
    ' --------------------- ' + options.title + ' --------------------- ' : '--'));
}

function createChoices(options) {
    var choices = _(options.packages)
        .filter(options.filter)
        .map(options.map)
        .compact()
        .valueOf();

    if (choices.length) {
        choices.unshift(unselectable(options));
        return choices;
    }

}

function interactive(packages, options) {

    var choicesPatch = createChoices({
            packages: packages,
            filter: { bump: 'patch'},
            map: _.partialRight(choice, {checked: true}),
            bgColor: 'bgGreen',
            title: 'Patch Versions :: backwards-compatible bug fixes'
        });

    var choicesMinor = createChoices({
            packages: packages,
            filter: { bump: 'minor'},
            map: choice,
            bgColor: 'bgYellow',
            title: 'Minor Versions :: New backwards-compatible features'
        });


    var choicesMajor = createChoices({
            packages: packages,
            filter: { bump: 'major'},
            map: choice,
            bgColor: 'bgRed',
            title: 'Major Versions :: Potentially breaking API changes, caution!'
        });

    var choicesNonSemver = createChoices({
            packages: packages,
            filter: { bump: 'nonSemver'},
            map: choice,
            bgColor: 'bgRed',
            title: 'Non-Semver :: versions less than 1.0.0'
        });


    var choices = _([])
        .concat(choicesPatch)
        .concat(choicesMinor)
        .concat(choicesMajor)
        .concat(choicesNonSemver)
        .compact()
        .valueOf();

    if (!choices.length) {
        console.log(emoji.heart + '  Your modules look ' + chalk.bold('amazing') + '. Keep up the great work.' + emoji.heart);
        return;
    }

    //        .concat(unselectable())


    var questions = [
        {
            name: 'update',
            message: 'choose',
            type: "checkbox",
            choices: choices
        }
    ];

    inquirer.prompt(questions, function(answers) {

        if (!answers.update || !answers.update.length) {
            console.log('Not updating anything.');
            return;
        };

        var args = _(['install'])
            .concat(options.global ? '-g' : null)
            .concat(chalk.supportsColor ? '--color=always' : null)
            .concat(answers.update)
            .compact()
            .valueOf();

        console.log('Running npm ' + args.join(' '));

        buffspawn('npm', args)
            .progress(function(buff){
                console.log(buff.toString());
            })
            .spread(function (stdout, stderr) {
            }, function (err) {
                console.err('Command failed with error code of #'  + err.status);
            });

    });
}

module.exports = interactive;