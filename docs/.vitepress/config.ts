import { defineConfig } from 'vitepress'
import { createDetypePlugin } from 'vitepress-plugin-detype'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { graphvizMarkdownPlugin } from 'vitepress-plugin-graphviz'
import { npmCommandsMarkdownPlugin } from 'vitepress-plugin-npm-commands'

const { detypeMarkdownPlugin, detypeVitePlugin } = createDetypePlugin()

export default defineConfig({
  title: 'Vitepress Plugins',
  description: "sapphi-red's vitepress plugins",
  themeConfig: {
    algolia: {
      appId: 'KQMH99B171',
      apiKey: '520ec1c8df02a3b0d2aaca23cd55cac6',
      indexName: 'vitepress-plugins-sapphi',
    },
    editLink: {
      pattern:
        'https://github.com/sapphi-red/vitepress-plugins/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/sapphi-red/vitepress-plugins',
      },
    ],
  },
  markdown: {
    async config(md) {
      md.use(tabsMarkdownPlugin)
      md.use(detypeMarkdownPlugin)
      md.use(npmCommandsMarkdownPlugin)
      await graphvizMarkdownPlugin(md)
    },
  },
  vite: {
    plugins: [detypeVitePlugin()],
    ssr: {
      external: [
        'vitepress-plugin-detype',
        'vitepress-plugin-graphviz',
        'vitepress-plugin-tabs',
        'vitepress-plugin-npm-commands',
      ],
    },
  },
})
