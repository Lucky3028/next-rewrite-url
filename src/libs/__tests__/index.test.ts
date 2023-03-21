import { generateRewriteRulesRecursively, RewriteRules } from '../index.js';

describe('generateRewriteRulesRecursively', () => {
  it('should generate rewrite rules recursively', () => {
    const rewrites: RewriteRules = {
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

    expect(generateRewriteRulesRecursively(rewrites)).toEqual(expected);
  });

  it('should generate them with suffix', () => {
    const SUFFIX = 'api';
    const rewrites: RewriteRules = {
      a: 'value1',
      b: {
        c: 'value2',
      },
    };
    const expected = [
      { [`${SUFFIX}/a`]: 'value1' },
      { [`${SUFFIX}/b/c`]: 'value2' },
    ];

    expect(generateRewriteRulesRecursively(rewrites, SUFFIX)).toEqual(expected);
  });
});
