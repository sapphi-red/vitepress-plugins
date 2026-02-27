import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import 'vitepress-plugin-graphviz/style.css'
import VersionBadge from './components/VersionBadge.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    app.component('VersionBadge', VersionBadge)
  },
} satisfies Theme
