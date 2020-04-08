import chalk from 'chalk';
import { LogTypes } from './LogTypes';
import { Utils } from '../Utils/Utils';

export class Logger {
  public static Error(...args: any): void {
    if (Utils.CheckLogLevel(LogTypes.ERROR)) {
      console.log(
        chalk.bold(Utils.Timestamp()),
        chalk.bold.red('ERROR:'),
        ...args,
      );
    }
  }

  public static Warning(...args: any): void {
    if (Utils.CheckLogLevel(LogTypes.WARNING)) {
      console.log(
        chalk.bold(Utils.Timestamp()),
        chalk.bold.yellow('WARNING:'),
        ...args,
      );
    }
  }

  public static Info(...args: any): void {
    if (Utils.CheckLogLevel(LogTypes.INFO)) {
      console.log(
        chalk.bold(Utils.Timestamp()),
        chalk.bold.grey('INFO:'),
        ...args,
      );
    }
  }

  public static Success(...args: any): void {
    if (Utils.CheckLogLevel(LogTypes.SUCCESS)) {
      console.log(
        chalk.bold(Utils.Timestamp()),
        chalk.bold.green('SUCCESS:'),
        ...args,
      );
    }
  }

  public static Debug(...args: any) {
    if (Utils.CheckLogLevel(LogTypes.DEBUG)) {
      console.log(chalk.bold(Utils.Timestamp()), chalk.cyan('DEBUG:'), ...args);
    }
  }
}
