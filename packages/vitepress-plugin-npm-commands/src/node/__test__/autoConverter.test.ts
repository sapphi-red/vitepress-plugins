import { test, expect } from 'vitest'
import { autoConverter } from '../autoConverter'

type TestCase = readonly [npm: string, yarn: string, pnpm: string]

const table: TestCase[] = [
  ['npm i', 'yarn install', 'pnpm install'],
  ['npm install', 'yarn install', 'pnpm install'],
  ['npm i vite', 'yarn add vite', 'pnpm add vite'],
  ['npm i -D vitest', 'yarn add -D vitest', 'pnpm add -D vitest'],
  ['npm update', 'yarn up', 'pnpm update'],
  ['npm uninstall vite', 'yarn remove vite', 'pnpm remove vite'],
  ['npm rebuild', 'yarn rebuild', 'pnpm rebuild'],
  ['npm run build', 'yarn run build', 'pnpm run build'],
  ['npm init vite', 'yarn create vite', 'pnpm create vite']
]

for (const [npm, yarn, pnpm] of table) {
  test.concurrent(`convert: ${JSON.stringify(npm)}`, () => {
    const y = autoConverter(npm, 'yarn')
    const p = autoConverter(npm, 'pnpm')
    expect([y, p]).toStrictEqual([yarn, pnpm])
  })
}
