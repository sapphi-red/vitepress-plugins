import type MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import type Token from 'markdown-it/lib/token'

type Params = {
  shareStateKey: string | undefined
}

const parseTabsParams = (input: string): Params => {
  const match = input.match(/key:(\S+)/)
  return {
    shareStateKey: match?.[1]
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
        return `<PluginTabs ${shareStateKeyProp}>\n`
      } else {
        return `</PluginTabs>\n`
      }
    }
  })

  md.use(container, 'tab', {
    render(tokens: Token[], index: number) {
      const token = tokens[index]
      if (token.nesting === 1) {
        const label = token.info.replace(/^\s*tab\s*/, '')
        const labelProp = `label="${md.utils.escapeHtml(label)}"`
        return `<PluginTabsTab ${labelProp}>\n`
      } else {
        return `</PluginTabsTab>\n`
      }
    }
  })
}
