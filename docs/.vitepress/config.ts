import { defineConfig } from 'vitepress'
import { createDetypePlugin } from 'vitepress-plugin-detype'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { npmCommandsMarkdownPlugin } from 'vitepress-plugin-npm-commands'

const { detypeMarkdownPlugin, detypeVitePlugin } = createDetypePlugin()

export default defineConfig({
  title: 'Vitepress Plugins',
  description: "sapphi-red's vitepress plugins",
  themeConfig: {
    algolia: {
      appId: 'ACQGK68BKU',
      appKey: 'b4c79549aa55db252d8676caf63e8f0d',
      indexName: 'vitepress-plugins-sapphi'
    },
    editLink: {
      pattern:
        'https://github.com/sapphi-red/vitepress-plugins/edit/main/docs/:path',
      text: 'Suggest changes to this page'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/sapphi-red/vitepress-plugins'
      }
    ]
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
      md.use(detypeMarkdownPlugin)
      md.use(npmCommandsMarkdownPlugin)
    }
  },
  vite: {
    plugins: [detypeVitePlugin()]
  }
})
