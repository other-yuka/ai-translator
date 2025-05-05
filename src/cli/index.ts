import { Command } from 'commander';
import initCommand from './commands/init';
import translateCmd from './commands/translate';

export const program = new Command()
  .name('@other-yuka/translator')
  .description('translator CLI')
  .helpOption('-h, --help', 'Show help')
  .addCommand(translateCmd)
  .addCommand(initCommand);
