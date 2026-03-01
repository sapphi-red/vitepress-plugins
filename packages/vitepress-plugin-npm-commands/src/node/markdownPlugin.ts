import type MarkdownIt from 'markdown-it'
import convert from 'npm-to-yarn'
import type { PackageManager } from './packageManager'
import { packageManagers } from './packageManager'
import { klona } from 'klona'

const tabsShareStateKey = '~npm-commands'
const npmCommandsCommandRE = new RegExp(
  `(?://\\s*\\[!=npm\\s+(${packageManagers.join('|')}|auto)\\])+$`,
  'm',
)

export const npmCommandsPlugin = (md: MarkdownIt) => {
  const shareStateKeyProp = `sharedStateKey="${md.utils.escapeHtml(tabsShareStateKey)}"`

  const originalFence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, , env] = args
    const token = tokens[idx]
    if (token.attrGet('----npm-disable') !== null) {
      // escape hatch to disable this feature
      const pos = token.attrIndex('----npm-disable')
      token.attrs?.splice(pos, 1)
      return originalFence(...args)
    }
    if (!npmCommandsCommandRE.test(token.content)) {
      return originalFence(...args)
    }

    const codes = generateEachPackageManagerCode(token.content)

    const slots = codes.map(([pkgManger, code]) => {
      const attrStr = token.attrs
        ? `{${token.attrs.map(([key, val]) => (val ? `${key}=${val}` : key)).join(' ')}}`
        : ''
      const codeWithFence = `${token.markup}${token.info}${attrStr}\n` + code + token.markup
      return `<PluginTabsTab label="${pkgManger}">${md.render(
        codeWithFence,
        klona(env),
      )}</PluginTabsTab>`
    })

    return `<PluginTabs ${shareStateKeyProp} variant="code">${slots.join('')}</PluginTabs>`
  }
}

const parseNpmCommandsCommandFromLine = (line: string) => {
  const m = line.match(npmCommandsCommandRE)
  if (!m) return null
  return m[1] as PackageManager | 'auto'
}

const generateEachPackageManagerCode = (input: string) => {
  const codes = Object.fromEntries(packageManagers.map((m) => [m, [] as string[]])) as Record<
    PackageManager,
    string[]
  >
  for (const line of input.split('\n')) {
    const pkgManager = parseNpmCommandsCommandFromLine(line)
    if (!pkgManager) {
      for (const key of packageManagers) {
        codes[key].push(line)
      }
    } else if (pkgManager === 'auto') {
      for (const key of packageManagers) {
        const convertedCommand = convert(line.replace(npmCommandsCommandRE, '').trimEnd(), key)
        codes[key].push(convertedCommand)
      }
    } else {
      codes[pkgManager].push(line.replace(npmCommandsCommandRE, ''))
    }
  }
  return Object.entries(codes).map(([key, val]) => [key as PackageManager, val.join('\n')] as const)
}
