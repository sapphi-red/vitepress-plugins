import type { Plugin } from 'vite'
import { ContentMap, contentMapKeyRE } from './contentMap'

export const detypePlugin = (contentMap: ContentMap): Plugin => {
  const pluginName = 'vitepress-detype'

  return {
    name: pluginName,
    configResolved(config) {
      const thisPluginIndex = config.plugins.findIndex(
        plugin => plugin.name === pluginName
      )
      if (thisPluginIndex < 0) {
        throw new Error('vitepress-detype plugin not found')
      }

      const thisPlugin = config.plugins[thisPluginIndex]
      // remove this plugin
      ;(config.plugins as Plugin[]).splice(thisPluginIndex, 1)

      const vuePluginIndex = config.plugins.findIndex(
        plugin => plugin.name === 'vite:vue'
      )
      if (vuePluginIndex < 0) {
        throw new Error('vue plugin not found')
      }

      // inject before vue plugin
      ;(config.plugins as Plugin[]).splice(vuePluginIndex, 0, thisPlugin)
    },
    async transform(content, id) {
      if (!id.endsWith('.md')) return

      const replaced = await asyncReplace(
        content,
        contentMapKeyRE,
        async match => {
          const content = await contentMap.get(match[0])
          if (!content) {
            throw new Error("content didn't exist")
          }
          if ('error' in content) {
            throw content.error
          }
          return content.result
        }
      )
      return replaced
    }
  }
}

async function asyncReplace(
  input: string,
  re: RegExp,
  replacer: (match: RegExpMatchArray) => string | Promise<string>
): Promise<string> {
  const replacements = await Promise.all(
    Array.from(input.matchAll(re), replacer)
  )
  let i = 0
  return input.replace(re, () => replacements[i++])
}
