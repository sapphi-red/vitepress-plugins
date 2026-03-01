import MarkdownIt from 'markdown-it'
import { test, expect, beforeAll } from 'vitest'
import { graphvizPlugin } from '../markdownPlugin'
import dedent from 'ts-dedent'
import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'

const s = '```'
let cacheDir: string

beforeAll(() => {
  cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'graphviz-test-'))
})

const setup = async () => {
  const md = MarkdownIt()
  await graphvizPlugin(md, { cacheDir })
  return md
}

test('renders dot code block as dual SVG divs', async () => {
  const md = await setup()
  const result = md.render(dedent`
    ${s}dot
    digraph { A -> B }
    ${s}
  `)
  expect(result).toContain('<div class="vp-graphviz light-only">')
  expect(result).toContain('<div class="vp-graphviz dark-only">')
  expect(result).toContain('<svg')
})

test('does not intercept non-dot fences', async () => {
  const md = await setup()
  const result = md.render(dedent`
    ${s}javascript
    console.log('hello')
    ${s}
  `)
  expect(result).not.toContain('vp-graphviz')
  expect(result).toContain('<code')
})

test('applies theme interpolation', async () => {
  const md = await setup()
  const result = md.render(dedent`
    ${s}dot
    digraph { A [color="\${red|blue}"] }
    ${s}
  `)
  // Light SVG should contain "red", dark should contain "blue"
  const lightMatch = result.match(/<div class="vp-graphviz light-only">([\s\S]*?)<\/div>/)
  const darkMatch = result.match(/<div class="vp-graphviz dark-only">([\s\S]*?)<\/div>/)
  expect(lightMatch?.[1]).toContain('red')
  expect(darkMatch?.[1]).toContain('blue')
})

test('runs preprocess for dot+name syntax', async () => {
  const md = MarkdownIt()
  await graphvizPlugin(md, {
    cacheDir,
    processors: {
      wrap: {
        preprocess: (content) => `digraph { ${content.trim()} }`,
      },
    },
  })

  const result = md.render(dedent`
    ${s}dot+wrap
    A -> B
    ${s}
  `)
  expect(result).toContain('<svg')
})

test('throws on unknown processor', async () => {
  const md = MarkdownIt()
  await graphvizPlugin(md, { cacheDir })

  expect(() =>
    md.render(dedent`
      ${s}dot+unknown
      digraph { A -> B }
      ${s}
    `),
  ).toThrow('Unknown graphviz processor "unknown"')
})

test('renders error div on invalid DOT', async () => {
  const md = await setup()
  const result = md.render(dedent`
    ${s}dot
    not valid dot {{{
    ${s}
  `)
  expect(result).toContain('vp-graphviz-error')
})

test('postprocess modifies SVG output', async () => {
  const md = MarkdownIt()
  await graphvizPlugin(md, {
    cacheDir,
    processors: {
      post: {
        postprocess: (svg) => svg.replace('<svg', '<svg class="custom"'),
      },
    },
  })

  const result = md.render(dedent`
    ${s}dot+post
    digraph { A -> B }
    ${s}
  `)
  expect(result).toContain('<svg class="custom"')
})

test('postprocess receives mode', async () => {
  const modes: string[] = []
  const md = MarkdownIt()
  await graphvizPlugin(md, {
    cacheDir,
    processors: {
      track: {
        postprocess: (svg, mode) => {
          modes.push(mode)
          return svg
        },
      },
    },
  })

  md.render(dedent`
    ${s}dot+track
    digraph { A -> B }
    ${s}
  `)
  expect(modes).toEqual(['light', 'dark'])
})

test('fence attrs passed to preprocess and postprocess', async () => {
  let preAttrs: Record<string, string> = {}
  let postAttrs: Record<string, string> = {}
  const md = MarkdownIt()
  await graphvizPlugin(md, {
    cacheDir,
    processors: {
      attrs: {
        preprocess: (content, attrs) => {
          preAttrs = attrs
          return content
        },
        postprocess: (svg, _mode, attrs) => {
          postAttrs = attrs
          return svg
        },
      },
    },
  })

  md.render(dedent`
    ${s}dot+attrs maxWidth=500 responsive
    digraph { A -> B }
    ${s}
  `)
  expect(preAttrs).toEqual({ maxWidth: '500', responsive: 'true' })
  expect(postAttrs).toEqual({ maxWidth: '500', responsive: 'true' })
})

test('processor with only postprocess (no preprocess)', async () => {
  const md = MarkdownIt()
  await graphvizPlugin(md, {
    cacheDir,
    processors: {
      postonly: {
        postprocess: (svg) => svg.replace('<svg', '<svg data-post="true"'),
      },
    },
  })

  const result = md.render(dedent`
    ${s}dot+postonly
    digraph { A -> B }
    ${s}
  `)
  expect(result).toContain('data-post="true"')
  expect(result).toContain('<svg')
})

test('different preprocess output produces different SVGs for same input', async () => {
  let call = 0
  const md = MarkdownIt()
  await graphvizPlugin(md, {
    cacheDir,
    processors: {
      dynamic: {
        preprocess: () => {
          // Return a different graph each call
          const label = call++ === 0 ? 'First' : 'Second'
          return `digraph { A [label="${label}"] }`
        },
      },
    },
  })

  const input = dedent`
    ${s}dot+dynamic
    same input every time
    ${s}
  `
  const first = md.render(input)
  const second = md.render(input)

  expect(first).toContain('First')
  expect(first).not.toContain('Second')
  expect(second).toContain('Second')
  expect(second).not.toContain('First')
})

test('postprocess runs on cache hits too', async () => {
  const md = MarkdownIt()
  await graphvizPlugin(md, {
    cacheDir,
    processors: {
      marker: {
        postprocess: (svg) => svg.replace('<svg', '<svg data-marked="yes"'),
      },
    },
  })

  const input = dedent`
    ${s}dot+marker
    digraph { CacheHit -> Test }
    ${s}
  `
  // First render — populates cache
  const first = md.render(input)
  expect(first).toContain('data-marked="yes"')

  // Second render — cache hit, postprocess should still apply
  const second = md.render(input)
  expect(second).toContain('data-marked="yes"')
})
