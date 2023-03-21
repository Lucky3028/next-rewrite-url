/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs/promises';
import { ZodError } from 'zod';

import { readConfig } from '../config.js';

vi.spyOn(fs, 'readFile');

const filledConfig = {
  rewrites: {},
  outputs: {
    ts: {
      enabled: true,
      output: '/output/ts/file.ts',
      exportType: 'named',
    },
    json: {
      enabled: true,
      output: '/output/json/file.json',
    },
  },
};

describe('readConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return values with valid json', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(filledConfig));

    await expect(readConfig('file')).resolves.toStrictEqual(filledConfig);
  });

  it.each([
    ['no outputs field', { outputs: undefined }],
    [
      'no ts field in outputs',
      { outputs: { ...filledConfig.outputs, ts: undefined } },
    ],
    [
      'no json field in outputs',
      { outputs: { ...filledConfig.outputs, json: undefined } },
    ],
  ])(`should throw an error: %s`, async (_, config) => {
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({ ...filledConfig, ...config }),
    );

    await expect(readConfig('file')).rejects.toBeInstanceOf(ZodError);
  });

  test('should throw an error when given unexpected extension output path as TS', async () => {
    const { output: _, ...rest } = filledConfig.outputs.ts;
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        ...filledConfig,
        outputs: { ...filledConfig.outputs, ts: { ...rest, output: 'aiueo' } },
      }),
    );

    await expect(readConfig('file')).rejects.toBeInstanceOf(ZodError);
  });

  test('should throw an error when given unexpected extension output path as json', async () => {
    const { output: _, ...rest } = filledConfig.outputs.ts;
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        ...filledConfig,
        outputs: {
          ...filledConfig.outputs,
          json: { ...rest, output: 'aiueo' },
        },
      }),
    );

    await expect(readConfig('file')).rejects.toBeInstanceOf(ZodError);
  });

  test('should return config with default output TS file path when no given', async () => {
    const { output: _, ...rest } = filledConfig.outputs.ts;
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        ...filledConfig,
        outputs: { ...filledConfig.outputs, ts: { ...rest } },
      }),
    );

    await expect(
      readConfig('file').then((s) => s.outputs.ts.output),
    ).resolves.toContain('.ts');
  });

  test('should return config with default output json file path when no given', async () => {
    const { output: _, ...rest } = filledConfig.outputs.json;
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        ...filledConfig,
        outputs: { ...filledConfig.outputs, json: { ...rest } },
      }),
    );

    await expect(
      readConfig('file').then((s) => s.outputs.json.output),
    ).resolves.toContain('.json');
  });
});
