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
const npmUpdate = new Set(['up', 'upgrade', 'udpate'])
const npmUninstall = new Set(['unlink', 'remove', 'rm', 'r', 'un'])
const npmRebuild = new Set(['rebuild', 'rb'])
const npmRun = new Set(['run-script', 'run', 'rum', 'urn'])
const npmInit = new Set(['init', 'create', 'innit'])

const converterList: ConverterInfo[] = [
  {
    match: /npm (?:([-\w]+)(?: ([^# ][^#]*))?)/,
    replacer: (pkgm, original, subCommand, arg) => {
      if (npmInstall.has(subCommand)) {
        if (arg === undefined) {
          return `${pkgm} install`
        }
        return `${pkgm} add ${arg}`
      }
      if (npmUpdate.has(subCommand)) {
        return pkgm === 'yarn' ? `yarn up ${arg}` : `pnpm update ${arg}`
      }
      if (npmUninstall.has(subCommand)) {
        return `${pkgm} remove ${arg}`
      }
      if (npmRebuild.has(subCommand)) {
        return `${pkgm} rebuild ${arg}`
      }
      if (npmRun.has(subCommand)) {
        return `${pkgm} run ${arg}`
      }
      if (npmInit.has(subCommand)) {
        if (arg === undefined) {
          return original
        }
        return `${pkgm} create ${arg}`
      }
      return `${pkgm} ${subCommand} ${arg}`
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
