import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { npmCommandsMarkdownPlugin } from 'vitepress-plugin-npm-commands'

export default defineConfig({
  title: 'Vitepress Plugins',
  description: "sapphi-red's vitepress plugins",
  themeConfig: {
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
      md.use(npmCommandsMarkdownPlugin)
    }
  }
})
