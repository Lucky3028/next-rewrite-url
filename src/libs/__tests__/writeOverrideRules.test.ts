import fs from 'fs/promises';

import {
  writeOverrideRulesAsJson,
  writeOverrideRulesAsTs,
} from '../writeOverrideRules.js';

vi.spyOn(fs, 'writeFile');
vi.mocked(fs.writeFile).mockResolvedValue(undefined);

beforeEach(() => {
  vi.resetAllMocks();
});

const WRITE_FILE_OPTION = { encoding: 'utf-8' };
const OUTPUT_FILE_PATH = 'file/path';
const OUTPUT_DATA = { data: 'is-here!' };

test('writeOverrideRulesAsJson should call write function', async () => {
  await writeOverrideRulesAsJson(OUTPUT_FILE_PATH, OUTPUT_DATA);

  expect(fs.writeFile).toHaveBeenNthCalledWith(
    1,
    OUTPUT_FILE_PATH,
    JSON.stringify(OUTPUT_DATA),
    WRITE_FILE_OPTION,
  );
});

const dataStr = JSON.stringify(OUTPUT_DATA);

test('writeOverrideRulesAsTs should call write function with default export', async () => {
  await writeOverrideRulesAsTs(OUTPUT_FILE_PATH, OUTPUT_DATA, false);

  const expectedData = `const overrideRules = ${dataStr};\n\nexport default overrideRules;`;

  expect(fs.writeFile).toHaveBeenNthCalledWith(
    1,
    OUTPUT_FILE_PATH,
    expectedData,
    WRITE_FILE_OPTION,
  );
});

test('writeOverrideRulesAsTs should call write function with named export', async () => {
  await writeOverrideRulesAsTs(OUTPUT_FILE_PATH, OUTPUT_DATA, true);

  const expectedData = `export const overrideRules = ${dataStr};`;

  expect(fs.writeFile).toHaveBeenNthCalledWith(
    1,
    OUTPUT_FILE_PATH,
    expectedData,
    WRITE_FILE_OPTION,
  );
});
