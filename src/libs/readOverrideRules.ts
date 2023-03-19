import fs from 'fs/promises';
import { z } from 'zod';

import { OverrideRules } from './index.js';

const overrideRulesSchema: z.ZodSchema<OverrideRules> = z.lazy(() =>
  z.record(z.union([z.string(), overrideRulesSchema])),
);

export const readJsonAsOverrideRules = async (filePath: string) =>
  fs
    .readFile(filePath)
    .then(async (buffer) =>
      overrideRulesSchema.parse(JSON.parse(buffer.toString())),
    );
