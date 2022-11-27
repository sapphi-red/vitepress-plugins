import type { App } from 'vue'
import PluginTabs from './PluginTabs.vue'
import { provideTabsSharedState } from './useTabs'

export const enhanceAppWithTabs = (app: App) => {
  provideTabsSharedState(app)
  app.component('PluginTabs', PluginTabs)
}
