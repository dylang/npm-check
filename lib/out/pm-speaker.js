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
        upgrade: pkg => pkg.moduleName + '@' + pkg.latest
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
    const isPnpm4 = installer === 'pnpm@4';
    const actions = {
        install: (installer === 'ied') ? 'install' : 'add',
        remove: isYarn ? 'remove' : 'uninstall'
    };
    actions.upgrade = actions.install;

    const options = [actions[action]];
    let save = {dev: [], normal: []};
    if (currentState.get('saveExact')) {
        options.push(isYarn ? '--exact' : '--save-exact');
    }

    if (chalk.supportsColor) {
        options.push('--color=always');
    }

    if (global) {
        // eslint-disable-next-line no-unused-expressions
        isYarn ? options.unshift('global') : options.push('--global');
    } else {
        save = {
            dev: isYarn ? ['--save-dev'] : ['--dev'],
            normal: (isYarn || isPnpm4) ? [] : ['--save']
        };
    }

    const args = [
        // Normal
        deps.length ? [...options, ...save.normal, ...deps] : null,
        // Devel
        devDeps.length ? [...options, ...save.dev, ...devDeps] : null
    ];

    return args;
}

module.exports.pmCli = pmCli;

/**
 * The above, for one package.
 */
function pmCli1(pkg, currentState, action = 'install') {
    const args = pmCli([pkg], currentState, action);
    const installer = currentState.get('installer').split('@')[0];
    return [installer].concat(args.find(x => x !== null));
}

module.exports.pmCli1 = pmCli1;

function doInstall(currentState, installer, args) {
    if (args === null) {
        return;
    }

    installer = installer.split('@')[0];
    console.log('');
    console.log(`$ ${chalk.green(installer)} ${chalk.green(args.join(' '))}`);
    const spinner = ora(`Installing using ${chalk.green(installer)}...`);
    spinner.enabled = spinner.enabled && currentState.get('spinner');
    spinner.start();

    return execa(installer, args, {cwd: currentState.get('cwd')}).then(output => {
        spinner.stop();
        console.log(output.stdout);
        console.log(output.stderr);

        return currentState;
    }).catch(error => {
        spinner.stop();
        throw error;
    });
}

module.exports.doInstall = doInstall;

