import { generateOverrideRulesRecursively, OverrideRules } from './index.js';

describe('generateOverrideRulesRecursively', () => {
  it('should generate override rules recursively', () => {
    const overrides: OverrideRules = {
      a: {
        b: 'value1',
        c: {
          d: 'value2',
          e: {
            f: 'value3',
          },
        },
      },
      g: 'value4',
    };

    const expected = [
      { 'a/b': 'value1' },
      { 'a/c/d': 'value2' },
      { 'a/c/e/f': 'value3' },
      { g: 'value4' },
    ];

    expect(generateOverrideRulesRecursively(overrides)).toEqual(expected);
  });

  it('should generate them with suffix', () => {
    const SUFFIX = 'api';
    const overrides: OverrideRules = {
      a: 'value1',
      b: {
        c: 'value2',
      },
    };
    const expected = [
      { [`${SUFFIX}/a`]: 'value1' },
      { [`${SUFFIX}/b/c`]: 'value2' },
    ];

    expect(generateOverrideRulesRecursively(overrides, SUFFIX)).toEqual(
      expected,
    );
  });
});
