import fs from 'fs/promises';
import { z } from 'zod';

const outputFileMustBeNonEmptyErrMessage =
  'Output file path must be non-empty.';

const generateOutputFileSchema = (extension: string) =>
  z
    .string()
    .nonempty(outputFileMustBeNonEmptyErrMessage)
    .default(`./rewrites.${extension}`)
    .refine(
      (s) => s.toLowerCase().endsWith(`.${extension}`),
      `Output file path must end with ".${extension}"`,
    );

const configBaseSchema = z.object({
  enabled: z.boolean().default(true),
  output: z.string().nonempty(outputFileMustBeNonEmptyErrMessage),
});

const exportTypeSchema = z.enum(['default', 'named']);

const configSchema = z.object({
  rewrites: z.unknown(),
  outputs: z.object({
    ts: configBaseSchema.extend({
      output: generateOutputFileSchema('ts'),
      exportType: exportTypeSchema.default('named'),
    }),
    json: configBaseSchema.extend({
      output: generateOutputFileSchema('json'),
    }),
  }),
});

export const readConfig = async (filePath: string) =>
  fs
    .readFile(filePath, { encoding: 'utf-8' })
    .then(async (contents) => configSchema.parse(JSON.parse(contents)));
