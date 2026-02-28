import type MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import type Token from 'markdown-it/lib/token.d.mts'
import { ruleBlockTab } from './ruleBlockTab'
import type * as Renderer from 'markdown-it/lib/renderer.d.mts'

type Params = {
  shareStateKey: string | undefined
  variant: string | undefined
}

const parseTabsParams = (input: string): Params => {
  const keyMatch = input.match(/key:(\S+)/)
  const variantMatch = input.match(/variant:(\S+)/)
  return {
    shareStateKey: keyMatch?.[1],
    variant: variantMatch?.[1],
  }
}

export const tabsPlugin = (md: MarkdownIt) => {
  md.use(container, 'tabs', {
    render(tokens: Token[], index: number) {
      const token = tokens[index]
      if (token.nesting === 1) {
        const params = parseTabsParams(token.info)
        const shareStateKeyProp = params.shareStateKey
          ? `sharedStateKey="${md.utils.escapeHtml(params.shareStateKey)}"`
          : ''
        const variantProp = params.variant
          ? `variant="${md.utils.escapeHtml(params.variant)}"`
          : ''
        const props = [shareStateKeyProp, variantProp].filter(Boolean).join(' ')
        return `<PluginTabs ${props}>\n`
      } else {
        return `</PluginTabs>\n`
      }
    },
  })

  md.block.ruler.after('container_tabs', 'tab', ruleBlockTab)
  const renderTab: Renderer.RenderRule = (tokens, index) => {
    const token = tokens[index]
    if (token.nesting === 1) {
      const label = token.info
      const labelProp = `label="${md.utils.escapeHtml(label)}"`
      return `<PluginTabsTab ${labelProp}>\n`
    } else {
      return `</PluginTabsTab>\n`
    }
  }
  md.renderer.rules['tab_open'] = renderTab
  md.renderer.rules['tab_close'] = renderTab
}
