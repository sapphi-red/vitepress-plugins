import { test, expect, beforeAll } from 'vitest'
import { initGraphviz, getGraphvizVersion, renderDot } from '../renderer'

beforeAll(async () => {
  await initGraphviz()
})

test('getGraphvizVersion returns a version string', () => {
  const version = getGraphvizVersion()
  expect(version).toMatch(/^\d+\.\d+\.\d+/)
})

test('renderDot produces SVG from valid DOT', () => {
  const svg = renderDot('digraph { A -> B }')
  expect(svg).toContain('<svg')
  expect(svg).toContain('</svg>')
})

test('renderDot throws on invalid DOT', () => {
  expect(() => renderDot('not valid dot {')).toThrow()
})
