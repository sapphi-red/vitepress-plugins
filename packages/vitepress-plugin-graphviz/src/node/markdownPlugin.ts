import type MarkdownIt from 'markdown-it'
import path from 'node:path'
import type { FenceAttrs } from './attributes'
import { parseFenceAttrs } from './attributes'
import { createCacheManager } from './cache'
import { interpolateTheme } from './interpolation'
import { getGraphvizVersion, initGraphviz, renderDot } from './renderer'

export type { FenceAttrs }

/**
 * A processor that can transform DOT source before rendering
 * and/or modify the rendered SVG after rendering.
 * Used with the `` ```dot+name `` fence syntax.
 */
export type Processor = {
  /** Transform content before rendering (DOT → DOT). */
  preprocess?: (content: string, attrs: FenceAttrs) => string
  /** Transform SVG after rendering (SVG → SVG). */
  postprocess?: (
    svg: string,
    mode: 'light' | 'dark',
    attrs: FenceAttrs,
  ) => string
}

export type GraphvizPluginOptions = {
  /**
   * Directory for cached SVG files.
   * Stale entries are cleaned up automatically via a manifest.
   * @default '.vitepress/cache/graphviz' (relative to cwd)
   */
  cacheDir?: string
  /**
   * Custom processors keyed by name.
   * When a `` ```dot+name `` fence is encountered, the matching processor
   * is called to transform content before and/or after rendering.
   */
  processors?: Record<string, Processor>
}

const FENCE_RE = /^dot(?:\+(\S+))?(?:\s+(.+))?$/

export async function graphvizPlugin(
  md: MarkdownIt,
  options?: GraphvizPluginOptions,
): Promise<void> {
  await initGraphviz()
  const graphvizVersion = getGraphvizVersion()

  const cacheDir =
    options?.cacheDir ?? path.join(process.cwd(), '.vitepress/cache/graphviz')
  const cache = createCacheManager(cacheDir)
  const processors = options?.processors ?? {}

  process.once('exit', () => {
    cache.writeManifest()
  })

  const originalFence = md.renderer.rules.fence!
  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token = tokens[idx]
    const info = token.info.trim()
    const match = FENCE_RE.exec(info)

    if (!match) {
      return originalFence(tokens, idx, opts, env, self)
    }

    const processorName = match[1]
    const attrs = parseFenceAttrs(match[2])
    let content = token.content
    let processor: Processor | undefined

    if (processorName) {
      processor = processors[processorName]
      if (!processor) {
        const available = Object.keys(processors)
        throw new Error(
          `Unknown graphviz processor "${processorName}". ` +
            `Available: ${available.length ? available.join(', ') : '(none)'}`,
        )
      }
    }

    if (processor?.preprocess) {
      content = processor.preprocess(content, attrs)
    }

    const lightDot = interpolateTheme(content, 'light')
    const darkDot = interpolateTheme(content, 'dark')

    try {
      let { lightSvg, darkSvg } = cache.getOrRender(
        lightDot,
        darkDot,
        graphvizVersion,
        renderDot,
      )

      if (processor?.postprocess) {
        lightSvg = processor.postprocess(lightSvg, 'light', attrs)
        darkSvg = processor.postprocess(darkSvg, 'dark', attrs)
      }

      return (
        `<div class="vp-graphviz light-only">${lightSvg}</div>` +
        `<div class="vp-graphviz dark-only">${darkSvg}</div>`
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return `<div class="vp-graphviz-error">${md.utils.escapeHtml(message)}</div>`
    }
  }
}
