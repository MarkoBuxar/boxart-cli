import { Logger } from '../Logger/Logger';
import { Utils } from '../Utils/Utils';
import { IGDB, Platform, Game } from '../IGDB/IGDB';
import { Config } from '../Config/Config';
import chalk from 'chalk';

export class GameSearch {
  public api: IGDB;
  protected platform: Platform[];
  protected auto: boolean;

  constructor(auto: boolean = false) {
    this.auto = auto;
  }

  public async initAPI(): Promise<void> {
    this.api = new IGDB(Config.Instance.Get('IGDB.key'));
    await IGDB.ApiCheck(this.api);
  }

  public async GetGame(g: string): Promise<Game[]> {
    try {
      let game: Game[] = await this.api.GetGame(g, [this.platform[0].id]);

      if (game.length === 0) {
        Logger.Error(`${g} not found`);
        return [];
      }
      if (game.length > 1) {
        if (this.auto) {
          game = await Utils.AutoSelect(game, 'name');
          console.log(chalk.bold('game:'), chalk.cyan(game[0].name));
        } else {
          game = await Utils.ManualSelect(game, 'name', `${g}\nSelect game:`);
        }
      } else {
        console.log(chalk.bold('game:'), chalk.cyan(game[0].name));
      }

      return game;
    } catch (exp) {
      Logger.Error(exp);
    }
  }

  public async GetPlatform(p: string): Promise<Platform[]> {
    try {
      let platform: Platform[] = await this.api.GetPlatform(p);
      if (platform.length === 0) {
        throw 'Platform not found';
      }
      if (platform.length > 1) {
        if (this.auto) {
          platform = await Utils.AutoSelect(platform, 'name');
          console.log(chalk.bold('Platform:'), chalk.cyan(platform[0].name));
        } else {
          platform = await Utils.ManualSelect(
            platform,
            'name',
            'Select platform:',
          );
        }
      } else {
        console.log(chalk.bold('platform:'), chalk.cyan(platform[0].name));
      }

      this.platform = platform;
      return this.platform;
    } catch (exp) {
      if (!exp) {
        throw '';
      }
      throw Logger.Error('error', exp);
    }
  }
}
