import config from './config.json';
import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import { Logger } from '../Logger/Logger';
import { timingSafeEqual } from 'crypto';

export class Config {
  private static _instance: Config;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public Get(p: string): any {
    return _.get(config, p);
  }

  public Set(p: string, value: any): object {
    _.set(config, p, value);
    this.Save();
    return config;
  }

  public Has(p: string): boolean {
    return _.has(config, p);
  }

  public Remove(p: string) {
    _.unset(config, p);
    this.Save();
  }

  private Save() {
    try {
      fs.writeFileSync(
        path.join(__dirname, 'config.json'),
        JSON.stringify(config, null, 2),
      );
    } catch (exp) {
      throw Logger.Error('Error saving to config');
    }
  }
}
