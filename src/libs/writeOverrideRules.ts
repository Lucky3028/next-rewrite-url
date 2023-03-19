import { writeFile } from 'fs/promises';

const options: Parameters<typeof writeFile>['2'] = { encoding: 'utf-8' };

export const writeOverrideRulesAsTs = async (
  filePath: string,
  data: unknown,
  isNamedExport: boolean,
) => {
  const json = JSON.stringify(data);
  const namedExportContents = `export const overrideRules = ${json};`;
  const defaultExportContents = `const overrideRules = ${json};\n\nexport default overrideRules;`;
  const contents = isNamedExport ? namedExportContents : defaultExportContents;

  return writeFile(filePath, contents, options);
};

export const writeOverrideRulesAsJson = async (
  filePath: string,
  data: unknown,
) => writeFile(filePath, JSON.stringify(data), options);
