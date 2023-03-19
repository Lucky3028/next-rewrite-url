import { readFile } from 'fs/promises';
import { z } from 'zod';

const outputFileMustBeNonEmptyErrMessage =
  'Output file path must be non-empty.';

const generateOutputFileSchema = (extension: string) =>
  z
    .string()
    .nonempty(outputFileMustBeNonEmptyErrMessage)
    .default(`./overrides.${extension}`)
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
  input: z.string().nonempty(outputFileMustBeNonEmptyErrMessage),
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
  readFile(filePath, { encoding: 'utf-8' }).then(configSchema.parseAsync);
