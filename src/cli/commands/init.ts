import * as p from '@clack/prompts';
import { Command } from 'commander';
import { loadConfig, saveConfig } from '../../services/config';
import { defaultConfig } from '../../specs';

export default new Command()
  .command('init')
  .description('init')
  .helpOption('-h, --help', 'Show help')
  .action(async options => {
    p.intro('ai-translator/init');

    const config = await loadConfig();
    if (config) {
      p.log.error('Config already exists. Please delete the existing config file and try again.');
    }

    await saveConfig(defaultConfig);
    p.outro('Config saved successfully.');
  });
