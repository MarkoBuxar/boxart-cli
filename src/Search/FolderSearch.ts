import path from 'path';
import fs from 'fs-extra';
import { Logger } from '../Logger/Logger';
import { GameSearch } from './GameSearch';
import { ImageSize, Game } from '../IGDB/IGDB';
import { Utils } from '../Utils/Utils';
import { FileDownload } from '../Download/FileDownload';

export class FolderSearch extends GameSearch {
  private files: string[];
  private platformName: string;

  constructor(platform: string, auto: boolean) {
    super(auto);
    this.platformName = platform;
  }

  // x / 100% * 100

  public async Search(source: string, destination: string): Promise<void> {
    try {
      await this.initAPI();
      await this.GetPlatform(this.platformName);
      const size: ImageSize = await Utils.SizeSelect();

      if (source !== '.' && !fs.existsSync(source)) {
        throw 'Folder doesn\'t exist';
      }
      this.files = await fs.readdir(source);

      if (!fs.existsSync(path.join(destination, '/boxart'))) {
        fs.mkdirSync(path.join(destination, '/boxart'));
      }

      if (this.auto) {
        this.files.forEach(async (name) => {
          name = path.parse(name).name;
          const game: Game[] = await this.GetGame(name);

          if (game.length === 0) {
            return;
          }
          const url = await this.api.GetCoverURL(+game[0].cover, size);
          await new FileDownload(
            url,
            path.join(destination, '/boxart'),
            name,
          ).Download();
          Logger.Success(name);
        });
      } else {
        const toDownload = [];

        for await (let name of this.files) {
          name = path.parse(name).name;
          const game: Game[] = await this.GetGame(name);

          if (game.length === 0) {
            continue;
          }
          const url = await this.api.GetCoverURL(+game[0].cover, size);
          toDownload.push({ url, name });
        }

        await Promise.all(
          toDownload.map(async (a) => {
            await new FileDownload(
              a.url,
              path.join(destination, '/boxart'),
              a.name,
            ).Download();
            Logger.Success(name);
          }),
        );
      }
    } catch (exp) {
      Logger.Error(exp);
    }
  }
}
