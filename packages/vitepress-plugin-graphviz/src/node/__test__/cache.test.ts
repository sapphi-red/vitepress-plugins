import { test as baseTest, expect } from 'vitest'
import { createCacheManager } from '../cache'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const test = baseTest.extend<{ tmpDir: string }>({
  tmpDir: async ({}, use) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'graphviz-cache-'))
    try {
      await use(dir)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  },
})

test('renders and caches SVG files on miss', ({ tmpDir }) => {
  const cache = createCacheManager(tmpDir)
  const result = cache.getOrRender('dot-light', 'dot-dark', '1.0.0', (dot) => `<svg>${dot}</svg>`)

  expect(result.lightSvg).toBe('<svg>dot-light</svg>')
  expect(result.darkSvg).toBe('<svg>dot-dark</svg>')

  const files = fs.readdirSync(tmpDir).filter((f) => f.endsWith('.svg'))
  expect(files).toHaveLength(2)
})

test('returns cached SVGs on hit', ({ tmpDir }) => {
  const cache = createCacheManager(tmpDir)
  let renderCount = 0
  const render = (dot: string) => {
    renderCount++
    return `<svg>${dot}</svg>`
  }

  cache.getOrRender('dot-light', 'dot-dark', '1.0.0', render)
  cache.getOrRender('dot-light', 'dot-dark', '1.0.0', render)

  expect(renderCount).toBe(2) // only first call renders (light + dark)
})

test('writeManifest saves used hashes', ({ tmpDir }) => {
  const cache = createCacheManager(tmpDir)
  cache.getOrRender('a', 'b', '1.0.0', (d) => `<svg>${d}</svg>`)
  cache.writeManifest()

  const manifest = JSON.parse(fs.readFileSync(path.join(tmpDir, 'manifest.json'), 'utf8'))
  expect(manifest.hashes).toHaveLength(1)
})

test('cleanup deletes SVGs not in previous manifest', ({ tmpDir }) => {
  // Simulate a previous build that cached some entries
  fs.writeFileSync(path.join(tmpDir, 'manifest.json'), '{"hashes":["keep"]}')
  fs.writeFileSync(path.join(tmpDir, 'keep-light.svg'), '<svg/>')
  fs.writeFileSync(path.join(tmpDir, 'keep-dark.svg'), '<svg/>')
  fs.writeFileSync(path.join(tmpDir, 'stale-light.svg'), '<svg/>')
  fs.writeFileSync(path.join(tmpDir, 'stale-dark.svg'), '<svg/>')

  // Creating a new cache manager triggers cleanup
  createCacheManager(tmpDir)

  const files = fs.readdirSync(tmpDir)
  expect(files).toContain('keep-light.svg')
  expect(files).toContain('keep-dark.svg')
  expect(files).not.toContain('stale-light.svg')
  expect(files).not.toContain('stale-dark.svg')
})
