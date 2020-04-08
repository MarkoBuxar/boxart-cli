import fs from 'fs-extra';
import { IGDB } from './IGDB/IGDB';
import { Logger } from './Logger/Logger';
import { Config } from './Config/Config';

export class BoxartCLI {
  private source: string;
  private destination: string;
  private manual: boolean;
  private igdb: IGDB;
  private files: string[];

  constructor() {
    this.igdb = new IGDB(Config.Instance.Get('IGDB.key'));
  }

  public async ReadFolder(source: string, destination: string): Promise<void> {
    try {
      Logger.Info(this.files);
    } catch (exp) {
      throw Logger.Error('Error reading directory');
    }
  }
}
