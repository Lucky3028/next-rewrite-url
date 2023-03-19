import fs from 'fs/promises';
import { ZodError } from 'zod';

import { readJsonAsOverrideRules } from '../readOverrideRules.js';

vi.spyOn(fs, 'readFile');

describe('readJsonAsOverrideRules', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['empty object', {}],
    ['single key value pair', { key: 'value' }],
    ['multi key value pairs', { key: 'value', key2: 'value2' }],
    ['nested key value pair', { nested: { key: 'value' } }],
  ])('should return values with valid Json: %s', async (_, object) => {
    vi.mocked(fs.readFile).mockImplementation(async () =>
      JSON.stringify(object),
    );

    await expect(readJsonAsOverrideRules('file')).resolves.toStrictEqual(
      object,
    );
  });

  it.each([
    ['value is boolean', { true: false }],
    ['value is double', { true: 0.1, key2: 'value2' }],
  ])('should throw a ZodError with invalid Json: %s', async (_, object) => {
    vi.mocked(fs.readFile).mockImplementation(async () =>
      JSON.stringify(object),
    );

    await expect(readJsonAsOverrideRules('file')).rejects.toBeInstanceOf(
      ZodError,
    );
  });
});
