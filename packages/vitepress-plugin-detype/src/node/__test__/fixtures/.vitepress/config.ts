import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { createDetypePlugin } from '../../..'

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
