import fs from 'fs/promises';
import { z } from 'zod';

import { RewriteRules } from './index.js';

const rewriteRulesSchema: z.ZodSchema<RewriteRules> = z.lazy(() =>
  z.record(z.union([z.string(), rewriteRulesSchema])),
);

export const readJsonAsRewriteRules = async (filePath: string) =>
  fs
    .readFile(filePath, { encoding: 'utf-8' })
    .then(async (contents) => rewriteRulesSchema.parse(JSON.parse(contents)));
