# next-rewrite-url

This library will output below files

- a JSON file (`.json`) containing [rewrites in next.config.js of Next.js](https://nextjs.org/docs/api-reference/next.config.js/rewrites) from JSON file
- a TypeScript file (`.ts`) to read more easily

## Backgrounds

 The Rewrites feature provided by Next.js works fine during SSR, including the development environment. This function can also be used to avoid CORS, which is very useful for communication with external APIs.  
 However, [it is not supported during SSG that use files generated by `next export`](https://nextjs.org/docs/advanced-features/static-html-export).  
 Therefore, it is necessary to switch between URLs based on using the Rewrites function and those that do not at the time of SSR and SSG. If you try to achieve this, the rewrites settings may be duplicated on the `next.config.js` and TypeScript code.  
 Thus, this package will generate both `.json` and `.ts` files containing Rewrites in a single configuration file, which can be read from both the Next.js configuration and the TypeScript codes.

## Usage

### Prepare

Prepare to install this package.

1. Create a personal access tokens (classic) on GitHub. The token must have `repo` and `read:packages` permissions.
2. Run the following commands.

```bash
echo "//npm.pkg.github.com/:_authToken=<The token value>" >> ~/.npmrc
cat > .yarnrc <<EOD
registry "https://registry.npmjs.org"
"@lucky3028:registry" "https://npm.pkg.github.com"
EOD
```

3. `yarn add -D @lucky3028/next-rewrite-url`
4. Add [config](#config) file.

### CLI

4. `yarn next-rewrite-url`

#### Options

- `-c <path>`: The path to a config file. Default is `./next-rewrite-url.config.json`

### GitHub Actions

4. Add the PAT to secrets (e.g. `NODE_AUTH_TOKEN`) on GitHub
5. Write action.yaml like:

```yaml
- uses: actions/setup-node@v3
  with:
    always-auth: true
    registry-url: 'https://npm.pkg.github.com'
- run: yarn install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NODE_AUTH_TOKEN }}
```

6. `yarn next-rewrite-url`

## Config

Example:

```json
{
  "rewrites": {
    "api-1": "https://example.com",
    "api-2": {
      "hello": "https://example.net/hello",
      "more": {
        "goodbye": "https://example.net/say/goodbye",
        "morning": "https://example.net/say/helloMorning"
      }
    }
  },
  "outputs": {
    "ts": {
      "enabled": true,
      "output": "/output/ts/file.ts",
      "exportType": "named",
    },
    "json": {
      "enabled": true,
      "output": "/output/json/file.json",
    }
  }
}
```

- `rewrites`: An record object of rewrite source and target.
- `outputs`
  - `ts`
    - `enabled`: Whether output `.ts` or not. Default is `true`.
    - `output`: Path to target `.ts` file. Default is `./rewrites.ts`.
    - `exportType`: Exports the rules with named export (`named`) ot default export (`default`). Default is named (`named`).
  - `json`
    - `enabled`: Whether output `.json` or not. Default is `true`.
    - `output`: Path to target `.json` file. Default is `./rewrites.json`.

## Development

Node.js and TypeScript are used for implementation.

Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

[MIT Licese](./LICENSE)
