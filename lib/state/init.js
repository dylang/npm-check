import _ from 'lodash';
import path from 'path';
import globalModulesPath from 'global-modules';
import readPackageJson from '../in/read-package-json.js';
import globalPackages from '../in/get-installed-packages.js';
import {enabled as emojiEnabled} from '../out/emoji.js';
import fs from 'fs';
import chalk from 'chalk';

function init(currentState, userOptions) {
    return new Promise((resolve, reject) => {
        _.each(userOptions, (value, key) => currentState.set(key, value));

        if (currentState.get('global')) {
            let modulesPath = globalModulesPath;

            if (process.env.NODE_PATH) {
                if (process.env.NODE_PATH.includes(path.delimiter)) {
                    modulesPath = process.env.NODE_PATH.split(path.delimiter)[0];
                    console.log(chalk.yellow('warning: Using the first of multiple paths specified in NODE_PATH'));
                } else {
                    modulesPath = process.env.NODE_PATH;
                }
            }

            if (!fs.existsSync(modulesPath)) {
                throw new Error('Path "' + modulesPath + '" does not exist. Please check the NODE_PATH environment variable.');
            }

            console.log(chalk.green('The global path you are searching is: ' + modulesPath));

            currentState.set('cwd', globalModulesPath);
            currentState.set('globalPackages', globalPackages(modulesPath));
        } else {
            const cwd = path.resolve(currentState.get('cwd'));
            const pkg = readPackageJson(path.join(cwd, 'package.json'));
            currentState.set('cwdPackageJson', pkg);
            currentState.set('cwd', cwd);
        }

        emojiEnabled(currentState.get('emoji'));

        if (currentState.get('cwdPackageJson').error) {
            return reject(currentState.get('cwdPackageJson').error);
        }

        return resolve(currentState);
    });
}

export default init;
