import fs from 'fs/promises';
import { z } from 'zod';

import { RewriteRules } from './index.js';

const rewriteRulesInputSchema: z.ZodSchema<RewriteRules> = z.lazy(() =>
  z.record(z.union([z.string(), rewriteRulesInputSchema])),
);

export const parseAsRewriteRulesInput = async (data: unknown) =>
  rewriteRulesInputSchema.parseAsync(data);

export const readRewriteRulesInputFromFile = async (filePath: string) =>
  fs
    .readFile(filePath, { encoding: 'utf-8' })
    .then((contents) => parseAsRewriteRulesInput(JSON.parse(contents)));
