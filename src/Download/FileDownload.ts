import fs from 'fs-extra';
import Axios from 'axios';
import path from 'path';
import { Logger } from '../Logger/Logger';

export class FileDownload {
  private url: string;
  private destination;
  private name;

  constructor(url: string, destination: string, name: string) {
    this.url = url;
    this.destination = destination;
    this.name = name;
  }

  public async Download(): Promise<void> {
    try {
      const ext = path.extname(this.url);
      const p = path.join(this.destination, `${this.name}${ext}`);

      const response = await Axios({
        method: 'GET',
        url: this.url,
        responseType: 'stream',
        onDownloadProgress: (e) => {
          const percentCompleted = Math.floor((e.loaded * 100) / e.total);
          Logger.Info(e);
        },
      });

      response.data.pipe(fs.createWriteStream(p));

      return new Promise((resolve, reject) => {
        response.data.on('end', () => {
          resolve();
        });

        response.data.on('error', () => {
          reject();
        });
      });
    } catch (exp) {
      Logger.Error(exp);
    }
  }
}
