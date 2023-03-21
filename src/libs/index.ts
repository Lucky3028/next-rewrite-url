// NOTE: TypeScript limitations do not allow type guessing of schemas using recursive types,
//       so I implement both types and type schemas myself.

export type RewriteRules = {
  [s: string]: string | RewriteRules;
};

const generateRules = (
  value: string | RewriteRules,
  accu: string,
  suffix: string,
): { [s: string]: string }[] => {
  if (typeof value === 'string') {
    const key = suffix ? `${suffix}/${accu}` : accu;

    return [{ [key]: value }];
  }

  return Object.entries(value).flatMap(([k, v]) => {
    const newAccu = accu ? `${accu}/${k}` : k;

    return generateRules(v, newAccu, suffix);
  });
};

export const generateRewriteRulesRecursively = (
  rewrites: RewriteRules,
  suffix = '',
) => generateRules(rewrites, suffix, '');
