import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const RENDERER_VERSION = 1

export type CacheManager = {
  getOrRender(
    lightDot: string,
    darkDot: string,
    graphvizVersion: string,
    render: (dot: string) => string,
  ): { lightSvg: string; darkSvg: string }
  writeManifest(): void
}

export function createCacheManager(cacheDir: string): CacheManager {
  const manifestPath = path.join(cacheDir, 'manifest.json')
  const usedHashes = new Set<string>()

  // Cleanup stale entries from previous build
  if (fs.existsSync(manifestPath)) {
    try {
      const raw = fs.readFileSync(manifestPath, 'utf8')
      const manifest: { hashes: string[] } = JSON.parse(raw)
      const validHashes = new Set(manifest.hashes)

      for (const file of fs.readdirSync(cacheDir)) {
        if (!file.endsWith('.svg')) continue
        const hash = file.split('-')[0]
        if (!validHashes.has(hash)) {
          fs.unlinkSync(path.join(cacheDir, file))
        }
      }
    } catch {
      // Ignore corrupt manifest
    }
  }

  return {
    getOrRender(lightDot, darkDot, graphvizVersion, render) {
      const hash = crypto
        .createHash('sha256')
        .update(`${RENDERER_VERSION}:${graphvizVersion}:${lightDot}:${darkDot}`)
        .digest('hex')
        .slice(0, 16)

      usedHashes.add(hash)

      const lightPath = path.join(cacheDir, `${hash}-light.svg`)
      const darkPath = path.join(cacheDir, `${hash}-dark.svg`)

      if (fs.existsSync(lightPath) && fs.existsSync(darkPath)) {
        return {
          lightSvg: fs.readFileSync(lightPath, 'utf8'),
          darkSvg: fs.readFileSync(darkPath, 'utf8'),
        }
      }

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }

      const lightSvg = render(lightDot)
      const darkSvg = render(darkDot)

      fs.writeFileSync(lightPath, lightSvg, 'utf8')
      fs.writeFileSync(darkPath, darkSvg, 'utf8')

      return { lightSvg, darkSvg }
    },

    writeManifest() {
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }
      fs.writeFileSync(
        manifestPath,
        JSON.stringify({ hashes: [...usedHashes] }),
        'utf8',
      )
    },
  }
}
