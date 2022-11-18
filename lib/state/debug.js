import chalk from 'chalk';

function debug(...rest) {
    console.log(chalk.green('[npm-check] debug'));
    console.log(...rest);
    console.log(`${chalk.green('===============================')}`);
}

export default debug;
