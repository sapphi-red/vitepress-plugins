import type MarkdownIt from 'markdown-it'
import { transform, removeMagicComments } from 'detype'
import type { Options as PrettierOptions } from 'prettier'
import type { ContentMap } from './contentMap'

const tabsShareStateKey = '\0detype'
const langs = ['ts', 'js'] as const
const detypeInfoRE = /^ts({[^}]*})?,=detype({[^}]*})?=$/

export const detypePlugin = (
  md: MarkdownIt,
  prettierOptions: PrettierOptions,
  contentMap: ContentMap
) => {
  const tabLabelsProp = `:tabLabels="${md.utils.escapeHtml(
    JSON.stringify(langs)
  )}"`
  const shareStateKeyProp = `sharedStateKey="${md.utils.escapeHtml(
    tabsShareStateKey
  )}"`

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const originalFence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, , env] = args
    const token = tokens[idx]

    const m = token.info.trim().match(detypeInfoRE)
    if (!m) {
      return originalFence(...args)
    }

    const [, tsAttrs = '', jsAttrs = ''] = m
    const slots = langs.map(lang => {
      const attrs = lang === 'ts' ? tsAttrs : jsAttrs
      const output = (async () => {
        try {
          const content =
            lang === 'ts'
              ? removeMagicComments(token.content, 'foo.ts', prettierOptions)
              : await transform(token.content, 'foo.ts', { prettierOptions, removeTsComments: true })
          const codeWithFence =
            `${token.markup}${lang}${attrs}\n` + content + token.markup
          return { result: md.render(codeWithFence, env) }
        } catch (e) {
          return { error: e }
        }
      })()
      const key = contentMap.add(`${token.markup}_${lang}_${attrs}`, token.content, output)
      return `<template #${lang}>${key}</template>`
    })

    return `<PluginTabs ${tabLabelsProp} ${shareStateKeyProp}>${slots.join(
      ''
    )}</PluginTabs>`
  }
}
