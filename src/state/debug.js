import chalk from 'chalk';

export default function debug() {
  console.log(chalk.green('[npm-check] debug'));
  console.log(...arguments);
  console.log(`${chalk.green('===============================')}`);
}
