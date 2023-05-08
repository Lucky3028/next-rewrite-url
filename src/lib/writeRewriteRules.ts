import fs from 'fs/promises';

import { RewriteRules } from './index.js';

const options: Parameters<typeof fs.writeFile>['2'] = { encoding: 'utf-8' };

const createFile = async (filePath: string, contents: string) => {
  try {
    await fs.writeFile(filePath, contents, options);
  } catch (e: unknown) {
    if (!(e instanceof Error)) {
      return;
    }

    if (e.name === 'ENOENT') {
      const dir = filePath.substring(0, filePath.lastIndexOf('/'));
      await fs
        .mkdir(dir, { recursive: true })
        .then(async () => createFile(filePath, contents));
    } else {
      throw e;
    }
  }
};

export const writeRewriteRulesAsTs = async (
  filePath: string,
  rules: RewriteRules,
  isNamedExport: boolean,
) => {
  const json = JSON.stringify(rules);
  const namedExportContents = `export const rewriteRules = ${json};`;
  const defaultExportContents = `const rewriteRules = ${json};\n\nexport default rewriteRules;`;
  const contents = isNamedExport ? namedExportContents : defaultExportContents;

  return createFile(filePath, contents);
};

export const writeRewriteRulesAsJson = async (
  filePath: string,
  rules: RewriteRules,
) => createFile(filePath, JSON.stringify(Object.values(rules)));
