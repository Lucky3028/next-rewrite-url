import fs from 'fs/promises';
import { z } from 'zod';

// NOTE: TypeScript limitations do not allow type guessing of schemas using recursive types,
//       so I implement both types and type schemas myself.

export type RewriteRulesInput = {
  [s: string]: string | RewriteRulesInput;
};

const rewriteRulesInputSchema: z.ZodSchema<RewriteRulesInput> = z.lazy(() =>
  z.record(z.union([z.string(), rewriteRulesInputSchema])),
);

export const parseAsRewriteRulesInput = async (data: unknown) =>
  rewriteRulesInputSchema.parseAsync(data);

export const readRewriteRulesInputFromFile = async (filePath: string) =>
  fs
    .readFile(filePath, { encoding: 'utf-8' })
    .then((contents) => parseAsRewriteRulesInput(JSON.parse(contents)));
