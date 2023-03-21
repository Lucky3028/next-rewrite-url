import fs from 'fs/promises';
import { z } from 'zod';

import { RewriteRules } from './index.js';

const rewriteRulesSchema: z.ZodSchema<RewriteRules> = z.lazy(() =>
  z.record(z.union([z.string(), rewriteRulesSchema])),
);

export const parseAsRewriteRules = async (data: unknown) =>
  rewriteRulesSchema.parseAsync(data);

export const readJsonAsRewriteRules = async (filePath: string) =>
  fs
    .readFile(filePath, { encoding: 'utf-8' })
    .then((contents) => parseAsRewriteRules(JSON.parse(contents)));
