import { test, expect } from 'vitest'
import { parseFenceAttrs } from '../attributes'

test('returns empty object for undefined input', () => {
  expect(parseFenceAttrs(undefined)).toEqual({})
})

test('returns empty object for empty string', () => {
  expect(parseFenceAttrs('')).toEqual({})
})

test('parses key=value pairs', () => {
  expect(parseFenceAttrs('maxWidth=500 height=300')).toEqual({
    maxWidth: '500',
    height: '300',
  })
})

test('parses quoted values with spaces', () => {
  expect(parseFenceAttrs('title="my graph" label="hello world"')).toEqual({
    title: 'my graph',
    label: 'hello world',
  })
})

test('parses bare flags as "true"', () => {
  expect(parseFenceAttrs('responsive debug')).toEqual({
    responsive: 'true',
    debug: 'true',
  })
})

test('parses mixed attributes', () => {
  expect(parseFenceAttrs('maxWidth=500 title="my graph" responsive')).toEqual({
    maxWidth: '500',
    title: 'my graph',
    responsive: 'true',
  })
})
