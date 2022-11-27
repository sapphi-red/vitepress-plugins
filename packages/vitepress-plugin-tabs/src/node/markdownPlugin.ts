import type MarkdownIt from 'markdown-it'
import { ruleBlockTabs } from './ruleBlockTabs'
import { parseTabsContent } from './parseTabsContent'

type Params = {
  shareStateKey: string | undefined
}

const parseParams = (input: string): Params => {
  if (!input.startsWith('=')) {
    return {
      shareStateKey: undefined
    }
  }

  const splitted = input.split('=')
  return {
    shareStateKey: splitted[1]
  }
}

export const tabsPlugin = (md: MarkdownIt) => {
  md.block.ruler.before('fence', '=tabs', ruleBlockTabs, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  })
  md.renderer.rules.tabs = (tokens, index, _options, env) => {
    const token = tokens[index]

    const tabs = parseTabsContent(token.content)
    const renderedTabs = tabs.map(tab => ({
      label: tab.label,
      content: md.render(tab.content, env)
    }))

    const params = parseParams(token.info)

    const tabLabelsProp = `:tabLabels="${md.utils.escapeHtml(
      JSON.stringify(tabs.map(tab => tab.label))
    )}"`
    const shareStateKeyProp = params.shareStateKey
      ? `sharedStateKey="${md.utils.escapeHtml(params.shareStateKey)}"`
      : ''
    const slots = renderedTabs.map(
      tab => `<template #${tab.label}>${tab.content}</template>`
    )

    return `<PluginTabs ${tabLabelsProp} ${shareStateKeyProp}>${slots.join(
      ''
    )}</PluginTabs>`
  }
}
