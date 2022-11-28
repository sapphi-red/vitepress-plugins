import type MarkdownIt from 'markdown-it'
import { autoConverter } from './autoConverter'
import { PackageManager, packageManagers } from './packageManager'

const tabsShareStateKey = '\0npm-commands'
const npmCommandsCommandRE = new RegExp(
  `(?://\\s*\\[!=npm\\s+(${packageManagers.join('|')}|auto)\\])+$`,
  'm'
)

export const npmCommandsPlugin = (md: MarkdownIt) => {
  const tabLabelsProp = `:tabLabels="${md.utils.escapeHtml(
    JSON.stringify(packageManagers)
  )}"`
  const shareStateKeyProp = `sharedStateKey="${md.utils.escapeHtml(
    tabsShareStateKey
  )}"`

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const originalFence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, , env] = args
    const token = tokens[idx]
    if (token.info.endsWith('=npm-disable')) {
      // escape hatch to disable this feature
      token.info = token.info.replace(/=npm-disable$/, '')
      return originalFence(...args)
    }
    if (!npmCommandsCommandRE.test(token.content)) {
      return originalFence(...args)
    }

    const codes = generateEachPackageManagerCode(token.content)

    const slots = codes.map(([pkgManger, code]) => {
      const attrStr = token.attrs
        ? `{${token.attrs.map(attr => attr[0]).join(',')}}`
        : ''
      const codeWithFence =
        `${token.markup}${token.info}${attrStr}\n` + code + token.markup
      return `<template #${pkgManger}>${md.render(
        codeWithFence,
        env
      )}</template>`
    })

    return `<PluginTabs ${tabLabelsProp} ${shareStateKeyProp}>${slots.join(
      ''
    )}</PluginTabs>`
  }
}

const parseNpmCommandsCommandFromLine = (line: string) => {
  const m = line.match(npmCommandsCommandRE)
  if (!m) return null
  return m[1] as PackageManager | 'auto'
}

const generateEachPackageManagerCode = (input: string) => {
  const codes = Object.fromEntries(
    packageManagers.map(m => [m, [] as string[]])
  ) as Record<PackageManager, string[]>
  for (const line of input.split('\n')) {
    const pkgManager = parseNpmCommandsCommandFromLine(line)
    if (!pkgManager) {
      for (const key of packageManagers) {
        codes[key].push(line)
      }
    } else if (pkgManager === 'auto') {
      for (const key of packageManagers) {
        const convertedCommand = autoConverter(
          line.replace(npmCommandsCommandRE, '').trimEnd(),
          key
        )
        codes[key].push(convertedCommand)
      }
    } else {
      codes[pkgManager].push(line.replace(npmCommandsCommandRE, ''))
    }
  }
  return Object.entries(codes).map(
    ([key, val]) => [key as PackageManager, val.join('\n')] as const
  )
}
