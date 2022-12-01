import type { PackageManager } from './packageManager'

type ConverterInfo = {
  match: RegExp
  replacer: (
    pkgm: Exclude<PackageManager, 'npm'>,
    fullMatch: string,
    ...matches: string[]
  ) => string
}

const npmInstall = new Set([
  'install',
  'add',
  'i',
  'in',
  'ins',
  'inst',
  'insta',
  'instal',
  'isnt',
  'isnta',
  'isntal',
  'isntall'
])
const npmUpdate = new Set(['update', 'up', 'upgrade', 'udpate'])
const npmUninstall = new Set(['uninstall', 'unlink', 'remove', 'rm', 'r', 'un'])
const npmRebuild = new Set(['rebuild', 'rb'])
const npmRun = new Set(['run-script', 'run', 'rum', 'urn'])
const npmInit = new Set(['init', 'create', 'innit'])

const converterList: ConverterInfo[] = [
  {
    match: /npm (?:([-\w]+)(?: ([^# ][^#]*))?)/,
    replacer: (pkgm, original, subCommand, _arg) => {
      const arg: string | undefined = _arg // undefined when not matched
      const argStr = arg !== undefined ? ` ${arg}` : ''

      if (npmInstall.has(subCommand)) {
        if (arg === undefined) {
          return `${pkgm} install`
        }
        return `${pkgm} add ${arg}`
      }
      if (npmUpdate.has(subCommand)) {
        return pkgm === 'yarn' ? `yarn up${argStr}` : `pnpm update${argStr}`
      }
      if (npmUninstall.has(subCommand) && arg !== undefined) {
        return `${pkgm} remove ${arg}`
      }
      if (npmRebuild.has(subCommand)) {
        return `${pkgm} rebuild${argStr}`
      }
      if (npmRun.has(subCommand) && arg !== undefined) {
        return `${pkgm} run ${arg}`
      }
      if (npmInit.has(subCommand) && arg !== undefined) {
        if (arg === undefined) {
          return original
        }
        return `${pkgm} create ${arg}`
      }

      return `${pkgm} ${subCommand}${argStr}`
    }
  }
]

export const autoConverter = (command: string, pkgManager: PackageManager) => {
  if (pkgManager === 'npm') return command

  let newCommand = command
  for (const converter of converterList) {
    newCommand = newCommand.replace(converter.match, (...args) =>
      converter.replacer(pkgManager, ...args)
    )
  }
  return newCommand
}
