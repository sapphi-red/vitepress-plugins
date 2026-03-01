import { test, expect } from 'vitest'
import { interpolateTheme } from '../interpolation'

test('replaces ${x|y} with x for light mode', () => {
  const input = 'color="${#333|#ddd}"'
  expect(interpolateTheme(input, 'light')).toBe('color="#333"')
})

test('replaces ${x|y} with y for dark mode', () => {
  const input = 'color="${#333|#ddd}"'
  expect(interpolateTheme(input, 'dark')).toBe('color="#ddd"')
})

test('handles multiple interpolations', () => {
  const input = 'a="${1|2}" b="${3|4}"'
  expect(interpolateTheme(input, 'light')).toBe('a="1" b="3"')
  expect(interpolateTheme(input, 'dark')).toBe('a="2" b="4"')
})

test('escapes $${', () => {
  const input = 'literal $${not|interpolated} here'
  expect(interpolateTheme(input, 'light')).toBe('literal ${not|interpolated} here')
  expect(interpolateTheme(input, 'dark')).toBe('literal ${not|interpolated} here')
})

test('passes through text without interpolation', () => {
  const input = 'digraph { A -> B }'
  expect(interpolateTheme(input, 'light')).toBe(input)
  expect(interpolateTheme(input, 'dark')).toBe(input)
})

test('handles empty values in interpolation', () => {
  const input = '${|hidden}'
  expect(interpolateTheme(input, 'light')).toBe('')
  expect(interpolateTheme(input, 'dark')).toBe('hidden')
})
