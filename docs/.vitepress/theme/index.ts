import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import VersionBadge from './components/VersionBadge.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    app.component('VersionBadge', VersionBadge)
  }
} satisfies Theme
