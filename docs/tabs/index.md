# vitepress-plugin-tabs

> A plugin that adds syntax for showing content in tabs.

<version-badge package="vitepress-plugin-tabs" />

## Installation

```sh
npm i -D vitepress-plugin-tabs // [!=npm auto]
```

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
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
  }
} satisfies Theme
```

## Syntax

### Tabs with non-shared selection state

```md
:::tabs
== tab a
a content
== tab b
b content
:::

:::tabs
== tab a
a content 2
== tab b
b content 2
:::
```

:::tabs
== tab a
a content
== tab b
b content
:::

:::tabs
== tab a
a content 2
== tab b
b content 2
:::

### Tabs with shared selection state

```md
:::tabs key:ab
== tab a
a content
== tab b
b content
:::

:::tabs key:ab
== tab a
a content 2
== tab b
b content 2
:::
```

:::tabs key:ab
== tab a
a content
== tab b
b content
:::

:::tabs key:ab
== tab a
a content 2
== tab b
b content 2
:::
