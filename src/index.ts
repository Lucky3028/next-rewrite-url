export type OverrideRules = {
  [s: string]: string | OverrideRules;
};

const generateRules = (
  value: string | OverrideRules,
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

export const generateOverrideRulesRecursively = (
  overrides: OverrideRules,
  suffix = '',
) => generateRules(overrides, suffix, '');
