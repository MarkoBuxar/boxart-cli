import Axios, { AxiosError } from 'axios';
import { Logger } from '../Logger/Logger';
import { Config } from '../Config/Config';
import inquirer from 'inquirer';

export enum ImageSize {
  COVER_SMALL = 'cover_small',
  COVER_BIG = 'cover_big',
  SCREENSHOT_SMALL = 'screenshot_med',
  SCREENSHOT_BIG = 'screenshot_huge',
  HD = '720p',
  FULL_HD = '1080p',
}

export interface Platform {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  name: string;
  url: string;
  cover: string;
  screenshots?: string[];
  artworks?: string[];
}

export class IGDB {
  private apiKey: string;
  private baseUrl: string = 'https://api-v3.igdb.com';

  public constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public static async ApiCheck(i: IGDB): Promise<void> {
    if (
      !Config.Instance.Has('IGDB.key') ||
      Config.Instance.Get('IGDB.key').length === 0
    ) {
      Logger.Warning('IGDB API key missing');
      const q = await inquirer.prompt([
        { type: 'input', name: 'key', message: 'Insert your IGDB api key' },
      ]);
      Config.Instance.Set('IGDB.key', q.key);
      i.apiKey = q.key;
      Logger.Success('API key successfully set');
    }
  }

  public static async ApiReset(): Promise<void> {
    if (
      await (
        await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Delete your API key?',
          },
        ])
      ).confirm
    ) {
      Config.Instance.Remove('IGDB.key');
      Logger.Success('IGDB API key successfully removed');
    } else {
      Logger.Info('Cancelling...');
    }
    process.exit();
  }

  public async GetPlatform(name: string): Promise<Platform[]> {
    try {
      const response = await Axios({
        url: `${this.baseUrl}/platforms`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': this.apiKey,
        },
        data: `fields name;search "${name}";`,
      });
      return response.data;
    } catch (exp) {
      throw this.ApiError(exp);
    }
  }

  public async GetGame(name: string, platforms: number[]): Promise<Game[]> {
    try {
      const response = await Axios({
        url: `${this.baseUrl}/games`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': this.apiKey,
        },
        data: `fields name,artworks,cover,screenshots,url;search "${name}"; where version_parent = null & category = 0 & cover != null & platforms = (${platforms.join(
          ',',
        )}) ; `,
      });
      return response.data;
    } catch (exp) {
      throw this.ApiError(exp);
    }
  }

  public async GetCoverURL(coverID: number, size: ImageSize): Promise<string> {
    try {
      const response = await Axios({
        url: `${this.baseUrl}/covers`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': this.apiKey,
        },
        data: `fields url;where id = (${coverID});`,
      });
      return `https://${response.data[0].url
        .substr(2)
        .replace('t_thumb', `t_${size}`)}`;
    } catch (exp) {
      throw this.ApiError(exp);
    }
  }

  private ApiError(exp) {
    Logger.Debug(new Error(exp));
    if (exp.response.status === 401) {
      Logger.Error('API authorization error');
    } else {
      Logger.Error('Error making HTTP request');
    }
  }
}
