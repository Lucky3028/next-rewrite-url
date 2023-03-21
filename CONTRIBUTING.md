# How to contribute

## How to start development

Before following the instructions below, see [them](./README.md#prepare).

1. `git clone https://github.com/Lucky3028/next-rewrite-url.git`  
Clone the repository.
1. `yarn prepare`  
Setup [husky](https://github.com/typicode/husky). This will run ESLint and Prettier every time you `git commit`.
1. `yarn dev`  
Run the CLI.

## About commit messages

* Follow [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/).
* "Types" follow in principle [Angular's Conventions](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type), but others are acceptable.

## About codes

1. the basics are based on [...TypeScript Deep Dive Japanese Style Guide (Coding Conventions)](https://typescript-jp.gitbook.io/deep-dive/styleguide).  
However, if there is any contradiction with the content of the following, the content of the following takes precedence.
1. Follow the ESLint and Prettier execution results
1. Try to keep the granularity per commit to a minimum
1. Use `type` rather than `interface` whenever possible to avoid unnecessary `extends` and type merging when unintentionally defining a `interface` of the same name.
1. Do not use `Enum`. Use the `Union` type instead.  
For more information, see [here](https://typescriptbook.jp/reference/values-types-variables/enum/enum-problems-and-alternatives-to-enums).
1. Use arrow functions to define React components.
1. Use named export rather than default export.
1. Do not use type assertions (`as`). Use only if the compiler's type inference is clearly wrong.  
Also, when using it, please provide a reason why it can be used.
1. Do not use non-null assertion operators (`!` or `!!`). Use them only when they are clearly not `null` or `undefined`.  
Also, if you use them, please provide a reason why they can be used.
1. Do not use the type `any`.
