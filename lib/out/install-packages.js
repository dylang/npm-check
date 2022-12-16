import chalk from 'chalk';
import {execa} from 'execa';
import ora from 'ora';

function install(packages, currentState) {
    if (packages.length === 0) {
        return Promise.resolve(currentState);
    }

    const installer = currentState.get('installer');
    const color = chalk.supportsColor ? '--color=always' : null;

    const isYarn = installer === 'yarn';

    const installGlobal = currentState.get('global') ? (isYarn ? 'global' : '--global') : null;
    const saveExact = currentState.get('saveExact') ? (isYarn ? '--exact' : '--save-exact') : null;

    const installCmd = isYarn ? 'add' : 'install';

    const npmArgs = [installCmd]
        .concat(installGlobal)
        .concat(saveExact)
        .concat(packages)
        .concat(color)
        .filter(Boolean);

    console.log('');
    console.log(`$ ${chalk.green(installer)} ${chalk.green(npmArgs.join(' '))}`);
    const spinner = ora(`Installing using ${chalk.green(installer)}...`);
    spinner.enabled = spinner.enabled && currentState.get('spinner');
    spinner.start();

    return execa(installer, npmArgs, {cwd: currentState.get('cwd')}).then(output => {
        spinner.stop();
        console.log(output.stdout);
        console.log(output.stderr);

        return currentState;
    }).catch(error => {
        spinner.stop();
        throw error;
    });
}

export default install;
