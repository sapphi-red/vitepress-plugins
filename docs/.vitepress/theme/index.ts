import Theme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import VersionBadge from './components/VersionBadge.vue'

export default {
  ...Theme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    app.component('VersionBadge', VersionBadge)
  }
}
