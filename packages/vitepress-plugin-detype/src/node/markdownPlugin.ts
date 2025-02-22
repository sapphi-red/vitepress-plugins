import type MarkdownIt from 'markdown-it'
import module from 'node:module'
import type { PrettierOptions } from 'detype'
import type { ContentMap } from './contentMap'
import type { SupportedType } from './parseDetypeInfo'
import { parseDetypeInfo } from './parseDetypeInfo'
import { klona } from 'klona'

const { transform, removeMagicComments } = module.createRequire(
  import.meta.url
)('detype') as typeof import('detype')

const tabsShareStateKey = '~detype'
const langs = ['ts', 'js'] as const
type Lang = (typeof langs)[number]

const getLangForRender = (type: SupportedType, lang: Lang) => {
  switch (type) {
    case 'vue':
      return 'vue'
    case 'tsx':
      return `${lang}x`
    case 'ts':
      return lang
  }
  exhaustiveCheck(type)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const exhaustiveCheck = (_p: never) => {}

export const detypePlugin = (
  md: MarkdownIt,
  prettierOptions: PrettierOptions,
  contentMap: ContentMap
) => {
  const shareStateKeyProp = `sharedStateKey="${md.utils.escapeHtml(
    tabsShareStateKey
  )}"`

  const originalFence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, , env] = args
    const token = tokens[idx]

    const parsed = parseDetypeInfo(token.info)
    if (parsed === null) {
      return originalFence(...args)
    }

    const { type, tsAttrs, jsAttrs } = parsed

    const slots = langs.map(lang => {
      const attrs = lang === 'ts' ? tsAttrs : jsAttrs
      const output = (async () => {
        try {
          const content =
            lang === 'ts'
              ? await removeMagicComments(
                  token.content,
                  `foo.${type}`,
                  prettierOptions
                )
              : await transform(token.content, `foo.${type}`, {
                  prettierOptions,
                  removeTsComments: true
                })
          const langForRender = getLangForRender(type, lang)
          const codeWithFence =
            `${token.markup}${langForRender}${attrs}\n` + content + token.markup
          return { result: md.render(codeWithFence, klona(env)) }
        } catch (e) {
          return { error: e }
        }
      })()
      const key = contentMap.add(
        `${type}_${token.markup}_${lang}_${attrs}`,
        token.content,
        output
      )
      return `<PluginTabsTab label="${lang}">${key}</PluginTabsTab>`
    })

    return `<PluginTabs ${shareStateKeyProp}>${slots.join('')}</PluginTabs>`
  }
}
