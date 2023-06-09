import fs from 'fs/promises';
import { ZodError } from 'zod';

import { readRewriteRulesInputFromFile } from '../readRewriteRulesInput.js';

vi.spyOn(fs, 'readFile');

describe('readRewriteRulesInputFromFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it.each([
    ['empty object', {}],
    ['single key value pair', { key: 'value' }],
    ['multi key value pairs', { key: 'value', key2: 'value2' }],
    ['nested key value pair', { nested: { key: 'value' } }],
  ])('should return values with valid json: %s', async (_, object) => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(object));

    await expect(readRewriteRulesInputFromFile('file')).resolves.toStrictEqual(
      object,
    );
  });

  it.each([
    ['value is boolean', { true: false }],
    ['value is double', { true: 0.1, key2: 'value2' }],
  ])('should throw a ZodError with invalid json: %s', async (_, object) => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(object));

    await expect(readRewriteRulesInputFromFile('file')).rejects.toBeInstanceOf(
      ZodError,
    );
  });
});
