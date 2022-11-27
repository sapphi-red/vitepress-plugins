# vitepress-plugin-tabs

> A plugin that adds syntax for showing content in tabs.

## Installation

:::=tabs=pkgManager
::npm

```sh
npm i -D vitepress-plugin-tabs
```

::yarn

```sh
yarn add -D vitepress-plugin-tabs
```

::pnpm

```sh
pnpm add -D vitepress-plugin-tabs
```

:::

## Usage

After installing the plugin, you'll need to edit both [App Config](https://vitepress.vuejs.org/config/app-configs) and [Theme Config](https://vitepress.vuejs.org/config/theme-configs).

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
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

### Tabs with non-shared selection state

```
:::=tabs
::a
a content

::b
b content
:::

:::=tabs
::a
a content 2

::b
b content 2
:::
```

:::=tabs
::a
a content

::b
b content
:::

:::=tabs
::a
a content 2

::b
b content 2
:::

### Tabs with shared selection state

```
:::=tabs=ab
::a
a content

::b
b content
:::

:::=tabs=ab
::a
a content 2

::b
b content 2
:::
```

:::=tabs=ab
::a
a content

::b
b content
:::

:::=tabs=ab
::a
a content 2

::b
b content 2
:::
