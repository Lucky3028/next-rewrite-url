import fs from 'fs/promises';
import { z } from 'zod';

import { RewriteRules } from './index.js';

const rewriteRulesSchema: z.ZodSchema<RewriteRules> = z.lazy(() =>
  z.record(z.union([z.string(), rewriteRulesSchema])),
);

export const parseStringAsRewriteRules = async (data: string) =>
  rewriteRulesSchema.parseAsync(JSON.parse(data));

export const readJsonAsRewriteRules = async (filePath: string) =>
  fs.readFile(filePath, { encoding: 'utf-8' }).then(parseStringAsRewriteRules);
