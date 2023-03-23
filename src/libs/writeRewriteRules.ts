import fs from 'fs/promises';

import { RewriteRules } from './index.js';

const options: Parameters<typeof fs.writeFile>['2'] = { encoding: 'utf-8' };

export const writeRewriteRulesAsTs = async (
  filePath: string,
  rules: RewriteRules,
  isNamedExport: boolean,
) => {
  const json = JSON.stringify(rules);
  const namedExportContents = `export const rewriteRules = ${json};`;
  const defaultExportContents = `const rewriteRules = ${json};\n\nexport default rewriteRules;`;
  const contents = isNamedExport ? namedExportContents : defaultExportContents;

  return fs.writeFile(filePath, contents, options);
};

export const writeRewriteRulesAsJson = async (
  filePath: string,
  rules: RewriteRules,
) => fs.writeFile(filePath, JSON.stringify(Object.values(rules)), options);
