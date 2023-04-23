import pluginTypescript from '@rollup/plugin-typescript';

import pkg from './package.json' assert { type: 'json' };

export default [
  // ESモジュール用設定
  {
    input: 'src/cli/index.ts',
    output: [
      {
        dir: 'dist/esm',
        format: 'es',
        entryFileNames: '[name].mjs',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginTypescript({
        declaration: true,
        declarationDir: 'dist/esm',
        rootDir: 'src',
      }),
    ],
  },
  // CommonJS用設定
  {
    input: 'src/cli/index.ts',
    output: [
      {
        dir: 'dist/cjs',
        format: 'cjs',
        entryFileNames: '[name].cjs',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginTypescript({
        declaration: true,
        declarationDir: 'dist/cjs',
        rootDir: 'src',
      }),
    ],
  },
];
