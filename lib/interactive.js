'use strict';

var _ = require('lodash');

var inquirer = require('inquirer');
var chalk = require('chalk');

function spacer(str, minLength) {
    var extraSpace = minLength - chalk.stripColor(str).length;
    return extraSpace > 0 ? new Array(extraSpace).join(' ') : '';
}

function label(pkg){
    var name = pkg.moduleName + ' '  + spacer(pkg.moduleName, 20);
    var versions = chalk.blue(pkg.installed) + ' to ' + chalk.blue(pkg.latest);
    var homepage = spacer(name + versions, 40) + ' ' + pkg.homepage;

    return name + versions + homepage;

}

function choice(pkg, i, data, options){
    //console.log('choice', i, options);

    if (!pkg.bump) {
        return;
    }
    return {
        checked: options && options.checked,
        value: pkg.moduleName,
        name: label(pkg)
    };
}

function section(color, label) {
    return new inquirer.Separator(chalk[color].black(' -------- ' + label + ' --------'));
}

function interactive(packages) {

    var choicesPatch = _(packages)
        .filter({ bump: 'patch'})
        .map(_.partialRight(choice, {checked: true}))
        .compact()
        .valueOf();

    var choicesMinor = _(packages)
        .filter({ bump: 'minor'})
        .map(choice)
        .compact()
        .valueOf();


    var choicesMajor = _(packages)
        .filter({ bump: 'major'})
        .map(choice)
        .compact()
        .valueOf();

    var choices = _([])
        .concat(section('bgBlack', ''))
        .concat(section('bgGreen', 'Patch Versions (bug fixes)'))
        .concat(choicesPatch)
        .concat(section('bgYellow', 'Minor Versions (new features)'))
        .concat(choicesMinor)
        .concat(section('bgRed', 'Major Versions (breaking changes, caution!'))
        .concat(choicesMajor)
        .concat(section('bgBlack', ''))
        .concat(section('bgBlack', ''))
        .valueOf();

    var questions = [
        {
            name: 'update',
            message: 'choose',
            type: "checkbox",
            choices: choices
        }
    ];

    inquirer.prompt(questions, function(answers) {
        console.log('answers', answers);
    });
}


module.exports = interactive;