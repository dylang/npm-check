import chalk from 'chalk';

export default function debug(...args) {
  console.log(chalk.green('[npm-check] debug'));
  console.log(args);
  console.log(`${chalk.green('===============================')}`);
}
