'use strict';
import chalk from "chalk";

function debug() {
    console.log(chalk.green('[npm-check] debug'));
    console.log.apply(console, arguments);
    console.log(`${chalk.green('===============================')}`);
}

export default debug;
