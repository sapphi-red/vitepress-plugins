# vitepress-plugin-npm-commands

> A plugin that adds syntax for showing `npm`, `yarn`, `pnpm` commands in tabs.

## Installation

```sh
npm i -D vitepress-plugin-npm-commands vitepress-plugin-tabs // [!=npm npm]
yarn add -D vitepress-plugin-npm-commands vitepress-plugin-tabs // [!=npm yarn]
pnpm add -D vitepress-plugin-npm-commands vitepress-plugin-tabs // [!=npm pnpm]
```

`vitepress-plugin-npm-commands` requires [`vitepress-plugin-tabs`](../tabs/) to be installed.

## Usage

After installing the plugin, you'll need to edit both [App Config](https://vitepress.vuejs.org/config/app-configs) and [Theme Config](https://vitepress.vuejs.org/config/theme-configs).

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { npmCommandsMarkdownPlugin } from 'vitepress-plugin-npm-commands'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
      md.use(npmCommandsMarkdownPlugin)
    }
  }
})
```

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

export default {
  ...Theme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
  }
}
```

## Syntax

**An example with single command.**

````=npm-disable
```sh
npm i vite // [!=npm npm]
yarn add vite // [!=npm yarn]
pnpm add vite // [!=npm pnpm]
```
````

```sh
npm i vite // [!=npm npm]
yarn add vite // [!=npm yarn]
pnpm add vite // [!=npm pnpm]
```

**An example with multiple command.**

````=npm-disable
```sh
npx degit user/project my-project // [!=npm npm]
yarn dlx degit user/project my-project // [!=npm yarn]
pnpm dlx degit user/project my-project // [!=npm pnpm]
cd my-project

npm install // [!=npm npm]
yarn install // [!=npm yarn]
pnpm install // [!=npm pnpm]
npm run dev // [!=npm npm]
yarn run dev // [!=npm yarn]
pnpm run dev // [!=npm pnpm]
```
````

```sh
npx degit user/project my-project // [!=npm npm]
yarn dlx degit user/project my-project // [!=npm yarn]
pnpm dlx degit user/project my-project // [!=npm pnpm]
cd my-project

npm install // [!=npm npm]
yarn install // [!=npm yarn]
pnpm install // [!=npm pnpm]
npm run dev // [!=npm npm]
yarn run dev // [!=npm yarn]
pnpm run dev // [!=npm pnpm]
```
