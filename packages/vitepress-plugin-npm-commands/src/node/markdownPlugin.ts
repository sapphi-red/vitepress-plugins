import type MarkdownIt from 'markdown-it'

const packageManagers = ['npm', 'yarn', 'pnpm'] as const
type PackageManager = typeof packageManagers[number]

const tabsShareStateKey = '\0npm-commands'
const npmCommandsCommandRE = new RegExp(
  `(?://\\s*\\[!=npm\\s+(${packageManagers.join('|')})\\])+$`,
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
      const codeWithFence =
        `${token.markup}${token.info}\n` + code + token.markup
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
  return m[1] as PackageManager
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
    } else {
      codes[pkgManager].push(line.replace(npmCommandsCommandRE, ''))
    }
  }
  return Object.entries(codes).map(
    ([key, val]) => [key as PackageManager, val.join('\n')] as const
  )
}
