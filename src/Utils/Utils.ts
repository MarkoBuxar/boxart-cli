import { Config } from '../Config/Config';
import { Logger } from '../Logger/Logger';
import inquirer from 'inquirer';
import { ImageSize } from '../IGDB/IGDB';

export class Utils {
  public static GetLogLevel(): string[] {
    return Config.Instance.Get('log.level');
  }

  public static CheckLogLevel(log: string): boolean {
    return this.GetLogLevel().includes(log);
  }

  public static Timestamp(): string {
    const today = new Date();
    return `[${today
      .getHours()
      .toString()
      .padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}]`;
  }

  public static async AutoSelect(
    choices: any[],
    selectBy: string,
  ): Promise<any> {
    const selected = [
      choices.reduce((a, b) => {
        return a[selectBy].length <= b[selectBy].length ? a : b;
      }),
    ];
    return selected;
  }

  public static async ManualSelect(
    choices: any[],
    selectBy: string,
    question: string,
  ): Promise<any[]> {
    const q = await inquirer.prompt({
      type: 'list',
      name: 'answer',
      message: question,
      choices: choices.map((a) => a[selectBy]),
    });
    return choices.filter((a) => a[selectBy] === q.answer);
  }

  public static async SizeSelect(): Promise<ImageSize> {
    const q = await inquirer.prompt({
      type: 'list',
      name: 'answer',
      message: 'Select image size',
      choices: Object.keys(ImageSize).map((key) => this.NormaliseEnum(key)),
    });
    return ImageSize[this.DeNormaliseEnum(q.answer)];
  }

  public static NormaliseEnum(str: string): string {
    return this.toJadenCase(str.replace(/_/g, ' '));
  }

  public static DeNormaliseEnum(str: string): string {
    return str.replace(/ /g, '_').toUpperCase();
  }

  public static toJadenCase(str: string): string {
    return str.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());
  }
}
