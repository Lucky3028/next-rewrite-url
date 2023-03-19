import yargs from 'yargs';

import { generateOverrideRulesRecursively } from '@/libs/index.js';
import { readJsonAsOverrideRules } from '@/libs/readOverrideRules.js';
import {
  writeOverrideRulesAsJson,
  writeOverrideRulesAsTs,
} from '@/libs/writeOverrideRules.js';

import { readConfig } from './config.js';

const parseArgs = async (rawArgv: string[]) => {
  const slicedArgs = rawArgv.slice(2);

  return yargs(slicedArgs)
    .usage('Usage: $0 [options]')
    .option('config', {
      description: 'Path to a next-override-url config',
      alias: 'c',
      type: 'string',
      default: './next-override-url.config.json',
    })
    .example('$0', 'Run with the default config path.')
    .example(
      '$0 -c /path/to/your/config/file',
      'Run with the specified config path.',
    )
    .help()
    .alias('help', 'h')
    .locale('en')
    .wrap(150)
    .parseAsync();
};

export const cli = async (rawArgv: string[]) => {
  const { config: configPath } = await parseArgs(rawArgv);
  if (!configPath.toLowerCase().endsWith('.json')) {
    console.error('Config file must be a json file.');
    process.exit(1);
  }

  const config = await readConfig(configPath).catch((err: Error) => {
    console.error('An error has occured while reading a config file.');
    console.error(err.message);
    process.exit(1);
  });

  const rules = await readJsonAsOverrideRules(config.input).then(
    generateOverrideRulesRecursively,
  );

  await writeOverrideRulesAsJson(config.outputs.json.output, rules);
  await writeOverrideRulesAsTs(
    config.outputs.ts.output,
    rules,
    config.outputs.ts.exportType === 'named',
  );

  console.info('Done!');
};
