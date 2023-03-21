import fs from 'fs/promises';

const options: Parameters<typeof fs.writeFile>['2'] = { encoding: 'utf-8' };

export const writeRewriteRulesAsTs = async (
  filePath: string,
  data: unknown,
  isNamedExport: boolean,
) => {
  const json = JSON.stringify(data);
  const namedExportContents = `export const rewriteRules = ${json};`;
  const defaultExportContents = `const rewriteRules = ${json};\n\nexport default rewriteRules;`;
  const contents = isNamedExport ? namedExportContents : defaultExportContents;

  return fs.writeFile(filePath, contents, options);
};

export const writeRewriteRulesAsJson = async (
  filePath: string,
  data: unknown,
) => fs.writeFile(filePath, JSON.stringify(data), options);
