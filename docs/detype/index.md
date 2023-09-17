---
title: vitepress-plugin-detype
---

# vitepress-plugin-detype

> A plugin that adds syntax for generating js from ts code snippet.

<version-badge package="vitepress-plugin-detype" />

This plugin uses [`detype`](https://github.com/cyco130/detype) to transform TypeScript to JavaScript.

## Installation

```sh
npm i -D vitepress-plugin-detype vitepress-plugin-tabs // [!=npm auto]
```

`vitepress-plugin-detype` requires [`vitepress-plugin-tabs`](../tabs/) to be installed.

## Usage

After installing the plugin, you'll need to edit both [App Config](https://vitepress.vuejs.org/config/app-configs) and [Theme Config](https://vitepress.vuejs.org/config/theme-configs).

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { createDetypePlugin } from 'vitepress-plugin-detype'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

const { detypeMarkdownPlugin, detypeVitePlugin } = createDetypePlugin()

export default defineConfig({
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
      md.use(detypeMarkdownPlugin)
    }
  },
  vite: {
    plugins: [detypeVitePlugin()]
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

### Simple

````md
```ts,=detype=
type Foo = {
  foo: string
}

const fooList: Foo[] = []
for (let i = 0; i < 100; i++) {
  const f = { foo: '' + i }
  fooList.push(f)

  const f2 = { bar: '' }
  // @ts-expect-error ignore!
  fooList.push(f2)
}
```
````

```ts,=detype=
type Foo = {
  foo: string
}

const fooList: Foo[] = []
for (let i = 0; i < 100; i++) {
  const f = { foo: '' + i }
  fooList.push(f)

  const f2 = { bar: '' }
  // @ts-expect-error ignore!
  fooList.push(f2)
}
```

This example uses `ts` but you can also use `tsx` and `vue`.

### With highlight line

````md
```ts{1-3,5},=detype{1}=
type Foo = {
  foo: string
}

const fooList: Foo[] = []
for (let i = 0; i < 100; i++) {
  const f = { foo: '' + i }
  fooList.push(f)

  const f2 = { bar: '' }
  // @ts-expect-error ignore!
  fooList.push(f2)
}
```
````

```ts{1-3,5},=detype{1}=
type Foo = {
  foo: string
}

const fooList: Foo[] = []
for (let i = 0; i < 100; i++) {
  const f = { foo: '' + i }
  fooList.push(f)

  const f2 = { bar: '' }
  // @ts-expect-error ignore!
  fooList.push(f2)
}
```

You could use [magic comments](https://github.com/cyco130/detype/blob/main/README.md#magic-comments), too.
