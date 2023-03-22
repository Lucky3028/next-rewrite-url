import { generateRewriteRules } from '../index.js';
import { RewriteRulesInput } from '../readRewriteRulesInput.js';

describe('generateRewriteRules', () => {
  it('should generate rewrite rules recursively', () => {
    const rewrites: RewriteRulesInput = {
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

    const expected = {
      '/a/b': {
        source: '/a/b',
        destination: 'value1',
      },
      '/a/c/d': {
        source: '/a/c/d',
        destination: 'value2',
      },
      '/a/c/e/f': {
        source: '/a/c/e/f',
        destination: 'value3',
      },
      '/g': { source: '/g', destination: 'value4' },
    };

    expect(generateRewriteRules(rewrites)).toEqual(expected);
  });

  it('should generate them with suffix', () => {
    const SUFFIX = 'api';
    const rewrites: RewriteRulesInput = {
      a: 'value1',
      b: {
        c: 'value2',
      },
    };
    const expected = {
      [`/${SUFFIX}/a`]: { source: `/${SUFFIX}/a`, destination: 'value1' },
      [`/${SUFFIX}/b/c`]: { source: `/${SUFFIX}/b/c`, destination: 'value2' },
    };

    expect(generateRewriteRules(rewrites, SUFFIX)).toEqual(expected);
  });
});
