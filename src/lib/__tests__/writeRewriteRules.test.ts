import fs from 'fs/promises';

import {
  writeRewriteRulesAsJson,
  writeRewriteRulesAsTs,
} from '../writeRewriteRules.js';

const WRITE_FILE_OPTION = { encoding: 'utf-8' };
const OUTPUT_FILE_PATH = 'file/path';
const OUTPUT_DATA = { data: { source: 'data', destination: 'is-here!' } };
const dataStr = JSON.stringify(OUTPUT_DATA);

vi.spyOn(fs, 'writeFile');
vi.mocked(fs.writeFile).mockResolvedValue(undefined);

beforeEach(() => {
  vi.resetAllMocks();
});

test('writeRewriteRulesAsJson should call write function', async () => {
  await writeRewriteRulesAsJson(OUTPUT_FILE_PATH, OUTPUT_DATA);

  expect(fs.writeFile).toHaveBeenNthCalledWith(
    1,
    OUTPUT_FILE_PATH,
    JSON.stringify(Object.values(OUTPUT_DATA)),
    WRITE_FILE_OPTION,
  );
});

test('writeRewriteRulesAsTs should call write function with default export', async () => {
  await writeRewriteRulesAsTs(OUTPUT_FILE_PATH, OUTPUT_DATA, false);

  const expectedData = `const rewriteRules = ${dataStr};\n\nexport type RewriteRuleKeys = keyof typeof rewriteRules;\n\nexport default rewriteRules;`;

  expect(fs.writeFile).toHaveBeenNthCalledWith(
    1,
    OUTPUT_FILE_PATH,
    expectedData,
    WRITE_FILE_OPTION,
  );
});

test('writeRewriteRulesAsTs should call write function with named export', async () => {
  await writeRewriteRulesAsTs(OUTPUT_FILE_PATH, OUTPUT_DATA, true);

  const expectedData = `export const rewriteRules = ${dataStr};\n\nexport type RewriteRuleKeys = keyof typeof rewriteRules;`;

  expect(fs.writeFile).toHaveBeenNthCalledWith(
    1,
    OUTPUT_FILE_PATH,
    expectedData,
    WRITE_FILE_OPTION,
  );
});
