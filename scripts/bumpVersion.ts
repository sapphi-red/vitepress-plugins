import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs/promises'
import semver from 'semver'
import { execa } from 'execa'

const releaseTypes = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease'
] as const
const assertType = (type: string): type is typeof releaseTypes[number] =>
  (releaseTypes as readonly string[]).includes(type)

;(async () => {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  const [, , packageShortName, type, dryRun] = process.argv

  const packageJsonPath = path.join(
    __dirname,
    `../packages/vitepress-plugin-${packageShortName}/package.json`
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let packageJsonContent: Record<string, any>
  try {
    packageJsonContent = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
  } catch {
    throw new Error(
      `${JSON.stringify(
        packageShortName
      )} does not exist or cannot parse package.json`
    )
  }

  if (!assertType(type)) {
    throw new Error(`only supports ${releaseTypes.join(', ')}`)
  }

  const isDryRun = dryRun === '--dry-run'

  const oldVersion = packageJsonContent.version
  const newVersion = semver.inc(oldVersion, type)
  console.log(
    `Bumped vitepress-plugin-${packageShortName} to ${newVersion} from ${oldVersion}`
  )
  packageJsonContent.version = newVersion

  if (!isDryRun) {
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJsonContent, undefined, 2) + '\n',
      'utf-8'
    )
  } else {
    console.log('[dry-run] skipped writing package.json')
  }

  if (!isDryRun) {
    await execa(`git tag vitepress-plugin-${packageShortName}@v${newVersion}`)
  } else {
    console.log('[dry-run] skipped creating tag')
  }
})()
