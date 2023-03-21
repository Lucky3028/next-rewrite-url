import yargs from 'yargs';
import { ZodError } from 'zod';

import { generateOverrideRulesRecursively } from '@/libs/index.js';
import { readJsonAsOverrideRules } from '@/libs/readOverrideRules.js';
import {
  writeOverrideRulesAsJson,
  writeOverrideRulesAsTs,
} from '@/libs/writeOverrideRules.js';

import { readConfig } from './config.js';
import { logger } from './logger.js';

const parseArgs = async (rawArgv: string[]) => {
  const slicedArgs = rawArgv.slice(2);

  return yargs(slicedArgs)
    .usage('Usage: $0 [options]')
    .option('config', {
      description: 'Path to a next-override-url config',
      alias: 'c',
      type: 'string',
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

const DEFAULT_CONFIG_PATH = 'next-override-url.config.json';
const WRITE_FILE_ERR = 'An error has occurred while writing a file';

export const cli = async (rawArgv: string[]) => {
  const { config: configPath } = await parseArgs(rawArgv);
  if (!configPath) {
    logger.warn(
      `The path to config file is not provided, so use "${DEFAULT_CONFIG_PATH}" as it.`,
    );
    logger.warn('To specify the path, run with "-c" option.');
  } else if (!configPath?.toLowerCase().endsWith('.json')) {
    logger.error('Config file must be a json file.');
    process.exit(1);
  }

  const config = await readConfig(configPath ?? DEFAULT_CONFIG_PATH).catch(
    (err: Error) => {
      logger.error('An error has occurred while reading a config file:');
      logger.error(err.message);
      process.exit(1);
    },
  );

  const rules = await readJsonAsOverrideRules(config.input)
    .then(generateOverrideRulesRecursively)
    .catch((err: Error) => {
      if (err instanceof ZodError) {
        logger.error(
          `An error has occurred while parsing ${config.input} as override rules:`,
        );
        logger.error(err.errors);
      } else {
        logger.error(`An error has occurred while reading ${config.input}:`);
        logger.error(err.message);
      }

      process.exit(1);
    });

  await writeOverrideRulesAsJson(config.outputs.json.output, rules).catch(
    (err: Error) => {
      logger.error(`${WRITE_FILE_ERR} to ${config.outputs.json.output}:`);
      logger.error(err.message);
      process.exit(1);
    },
  );
  await writeOverrideRulesAsTs(
    config.outputs.ts.output,
    rules,
    config.outputs.ts.exportType === 'named',
  ).catch((err: Error) => {
    logger.error(`${WRITE_FILE_ERR} to ${config.outputs.ts.output}:`);
    logger.error(err.message);
    process.exit(1);
  });

  logger.info('Done!');
};
