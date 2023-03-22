import { RewriteRulesInput } from './readRewriteRulesInput.js';

export type RewriteRules = {
  [s: string]: {
    source: string;
    destination: string;
  };
};

const flattenRewriteRules = (
  value: string | RewriteRulesInput,
  accu: string,
  suffix: string,
): { [s: string]: string }[] => {
  if (typeof value === 'string') {
    const key = suffix ? `${suffix}/${accu}` : accu;

    return [{ [`/${key}`]: value }];
  }

  return Object.entries(value).flatMap(([k, v]) => {
    const newAccu = accu ? `${accu}/${k}` : k;

    return flattenRewriteRules(v, newAccu, suffix);
  });
};

export const generateRewriteRules = (
  rewrites: RewriteRulesInput,
  suffix = '',
): RewriteRules =>
  flattenRewriteRules(rewrites, suffix, '')
    .flatMap((v) =>
      Object.entries(v).map(([source, destination]) => ({
        [source]: { source, destination },
      })),
    )
    .reduce((accu, value) => ({ ...accu, ...value }));
