import * as p from '@clack/prompts';
import { Command } from 'commander';

import { CONFIG_FILE, loadConfig } from 'src/services/config';
import { createTranslator } from 'src/services/translation/translator';
import { defaultConfig } from 'src/specs';

export default new Command()
  .command('translate')
  .description('translate')
  .helpOption('-h, --help', 'Show help')
  .action(async options => {
    p.intro('ai-translator/translate');
    const config = await loadConfiguration();

    const translator = createTranslator(config.ai);

    const sourceLocale = config.locales.source;
    for (const targetLocale of config.locales.targets) {
      const localeRules = config.localeRules?.[targetLocale] ?? [];
      const result = await translator.translate({
        sourceLocale,
        targetLocale,
        localeRules,
        context: {
          message: 'Hello, world!',
        },
      });
      console.log(result);
    }
  });

async function loadConfiguration() {
  const spinner = p.spinner();
  spinner.start('Loading configuration...');
  let config = await loadConfig();
  if (!config) {
    config = defaultConfig;
    spinner.stop(`No ${CONFIG_FILE} config found. Using default configuration.`);
  } else {
    spinner.stop('Configuration loaded.');
  }
  return config;
}
