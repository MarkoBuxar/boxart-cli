#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import program from 'commander';
import { Logger } from './Logger/Logger';
import { Utils } from './Utils/Utils';
import { FolderSearch } from './Search/FolderSearch';
import { GameSearch } from './Search/GameSearch';
import { ImageSize, IGDB } from './IGDB/IGDB';
import { FileDownload } from './Download/FileDownload';

process.on('unhandledRejection', (reason, p) => {
  // lol
});

const main = async () => {
  try {
    clear();
    console.log(
      chalk.bold.cyan(
        figlet.textSync('Boxart CLI', {
          horizontalLayout: 'full',
        }),
      ),
    );
    // Rozzo
    // Nancyj-Underlined

    program
      .version('0.0.1')
      .name('boxart-cli')
      .description('Videogame boxart downloader')
      .option(
        '-a, --auto-select',
        'automatically choose if search returns multiple results',
      )
      .option('-r, --reset-api', 'reset IGDB API key')
      .option(
        '-d, --destination <destination>',
        '(game) file output directory',
      );

    program
      .command('folder <platform> <source> <destination>')
      .description('Automatically download boxart from roms')
      .action(async (platform, source, destination) => {
        const folderSearch = await new FolderSearch(
          platform,
          program.autoSelect,
        );
        folderSearch.Search(source, destination);
      });

    program
      .command('game <platform> <game>')
      .description('Download boxart for specific game')
      .action(async (platform, name) => {
        try {
          const gameSearch = new GameSearch(program.autoSelect);
          await gameSearch.initAPI();
          await gameSearch.GetPlatform(platform);
          const game = await gameSearch.GetGame(name);
          if (game.length === 0) {
            return;
          }
          const size: ImageSize = await Utils.SizeSelect();
          const url = await gameSearch.api.GetCoverURL(+game[0].cover, size);
          await new FileDownload(
            url,
            program.destination || '.',
            game[0].name,
          ).Download();
        } catch (exp) {
          // Logger.Error(exp);
        }
      });

    program.parse(process.argv);

    if (program.resetApi) {
      await IGDB.ApiReset();
    }

    if (!process.argv.slice(2).length) {
      program.help();
    }
  } catch (exp) {
    throw Logger.Error(exp);
  }
};

main();
