import fs from 'fs/promises';

import { readConfig } from '../config.js';

vi.spyOn(fs, 'readFile');

const filledConfig = {
  input: '/input/file/path',
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

  it('should return values with valid Json', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(filledConfig));

    await expect(readConfig('file')).resolves.toStrictEqual(filledConfig);
  });
});
