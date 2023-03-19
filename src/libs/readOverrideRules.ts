import { readFile } from 'fs/promises';
import { z } from 'zod';

import { OverrideRules } from './index.js';

const overrideRulesSchema: z.ZodSchema<OverrideRules> = z.lazy(() =>
  z.record(z.union([z.string(), overrideRulesSchema])),
);

export const readJsonAsOverrideRules = async (filePath: string) =>
  readFile(filePath, { encoding: 'utf-8' }).then(async (contents) =>
    overrideRulesSchema.parse(JSON.parse(contents)),
  );
