import {
  writeOverrideRulesAsJson,
  writeOverrideRulesAsTs,
} from '../writeOverrideRules.js';

afterEach(() => {
  vi.restoreAllMocks();
});

beforeAll(() => {
  vi.mock('node:fs/promises', async () => ({
    ...(await vi.importActual<typeof import('node:fs/promises')>(
      'node:fs/promises',
    )),
    writeFile: vi.fn().mockReturnValue(() => undefined),
  }));
});

const WRITE_FILE_OPTION = { encoding: 'utf-8' };
const OUTPUT_FILE_PATH = 'file/path';
const OUTPUT_DATA = { data: 'is-here!' };

test('writeOverrideRulesAsJson should call write function', async () => {
  const { writeFile } = await import('node:fs/promises');

  await writeOverrideRulesAsJson(OUTPUT_FILE_PATH, OUTPUT_DATA);

  expect(writeFile).toHaveBeenNthCalledWith(
    1,
    OUTPUT_FILE_PATH,
    JSON.stringify(OUTPUT_DATA),
    WRITE_FILE_OPTION,
  );
});

describe('writeOverrideRulesAsTs', () => {
  const dataStr = JSON.stringify(OUTPUT_DATA);

  test('should call write function with default export', async () => {
    const { writeFile } = await import('node:fs/promises');

    await writeOverrideRulesAsTs(OUTPUT_FILE_PATH, OUTPUT_DATA, false);

    const expectedData = `const overrideRules = ${dataStr};\n\nexport default overrideRules;`;

    expect(writeFile).toHaveBeenNthCalledWith(
      1,
      OUTPUT_FILE_PATH,
      expectedData,
      WRITE_FILE_OPTION,
    );
  });

  test('should call write function with named export', async () => {
    const { writeFile } = await import('node:fs/promises');

    await writeOverrideRulesAsTs(OUTPUT_FILE_PATH, OUTPUT_DATA, true);

    const expectedData = `export const overrideRules = ${dataStr};`;

    expect(writeFile).toHaveBeenNthCalledWith(
      1,
      OUTPUT_FILE_PATH,
      expectedData,
      WRITE_FILE_OPTION,
    );
  });
});
