import yargs from 'yargs';
import { ZodError } from 'zod';

import { generateRewriteRulesRecursively } from '@/libs/index.js';
import { parseAsRewriteRules } from '@/libs/readRewriteRules.js';
import {
  writeRewriteRulesAsJson,
  writeRewriteRulesAsTs,
} from '@/libs/writeRewriteRules.js';

import { readConfig } from './config.js';
import { logger } from './logger.js';

const parseArgs = async (rawArgv: string[]) => {
  const slicedArgs = rawArgv.slice(2);

  return yargs(slicedArgs)
    .usage('Usage: $0 [options]')
    .option('config', {
      description: 'Path to a config',
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

const DEFAULT_CONFIG_PATH = 'next-rewrite-url.config.json';
const WRITE_FILE_ERR = 'An error has occurred while writing a file';

export const cli = async (rawArgv: string[]) => {
  const { config: configPath } = await parseArgs(rawArgv);
  if (!configPath) {
    logger.warn(
      `The path to a config file is not provided, so "${DEFAULT_CONFIG_PATH}" is used as it.`,
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

  const rules = await parseAsRewriteRules(config.rewrites)
    .then(generateRewriteRulesRecursively)
    .catch((err: Error) => {
      if (err instanceof ZodError) {
        logger.error(`An error has occurred while parsing values in config:`);
        logger.error(err.errors);
      } else {
        logger.error(`An error has occurred while reading rewrites:`);
        logger.error(err.message);
      }

      process.exit(1);
    });

  if (config.outputs.json.enabled) {
    const outputPath = config.outputs.json.output;

    await writeRewriteRulesAsJson(outputPath, rules).catch((err: Error) => {
      logger.error(`${WRITE_FILE_ERR} to ${outputPath}:`);
      logger.error(err.message);
      process.exit(1);
    });
  }
  if (config.outputs.ts.enabled) {
    const outputPath = config.outputs.ts.output;

    await writeRewriteRulesAsTs(
      outputPath,
      rules,
      config.outputs.ts.exportType === 'named',
    ).catch((err: Error) => {
      logger.error(`${WRITE_FILE_ERR} to ${outputPath}:`);
      logger.error(err.message);
      process.exit(1);
    });
  }

  logger.info('Done!');
};
