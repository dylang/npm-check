'use strict';

const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

/**
 * Returns arrays of arguments for the PM.
 *
 * @param {Package[]} packages
 * @param {CurrentState} currentState
 * @param {'install' | 'upgrade' | 'remove' | undefined} action
 *
 * @returns {(string[] | null)[]} array of options.
 */
function pmCli(packages, currentState, action = 'install') {
    if (!packages.length) {
        return Promise.resolve(currentState);
    }

    const nameGen = {
        install: pkg => pkg.moduleName,
        remove: pkg => pkg.moduleName,
        update: pkg => pkg.moduleName + '@' + pkg.latest,
    };

    const deps = packages
        .filter(pkg => !pkg.devDependency)
        .map(nameGen[action]);

    const devDeps = packages
        .filter(pkg => pkg.devDependency)
        .map(nameGen[action]);

    const installer = currentState.get('installer');
    const global = currentState.get('global');
    const isYarn = installer === 'yarn';
    const actions = {
        install: isYarn ? 'add' : 'install',
        remove: isYarn ? 'remove' : 'uninstall'
    }
    actions.update = actions.install;

    const options = [actions[action]];
    let save = { dev: [], normal: [] };
    if (currentState.get('saveExact'))
        options.push(isYarn ? '--exact' : '--save-exact');
    if (chalk.supportsColor)
        options.push('--color=always');

    if (global) {
        isYarn ? options.unshift('global') : options.push('--global');
    } else {
        save = {
            dev: isYarn ? ['--save-dev'] : ['--dev'],
            normal: isYarn ? [] : ['--save']
        };
    }

    const args = [
        // Normal
        deps.length ? [options, ...save['normal'], ...deps] : null,
        // Devel
        devDeps.length ? [options, ...save['dev'], ...devDeps] : null
    ];

    return args;
}
module.exports.pmCli = pmCli;

/**
 * The above, for one package.
 */
function pmCli1(package, currentState, action = 'install') {
    const args = pmCli([package], currentState, action);
    return args.find(x => x != null);
}
module.exports.pmCli1 = pmCli1;

function doInstall(installer, args) {
    if (args === null)
        return;

    console.log('');
    console.log(`$ ${chalk.green(installer)} ${chalk.green(args.join(' '))}`);
    const spinner = ora(`Installing using ${chalk.green(installer)}...`);
    spinner.enabled = spinner.enabled && currentState.get('spinner');
    spinner.start();

    return execa(installer, args, { cwd: currentState.get('cwd') }).then(output => {
        spinner.stop();
        console.log(output.stdout);
        console.log(output.stderr);

        return currentState;
    }).catch(err => {
        spinner.stop();
        throw err;
    });
}
module.exports.doInstall = doInstall;

