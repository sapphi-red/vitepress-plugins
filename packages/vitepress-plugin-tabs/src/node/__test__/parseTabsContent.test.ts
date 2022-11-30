import { test, expect } from 'vitest'
import { parseTabsContent } from '../parseTabsContent'
import dedent from 'ts-dedent'

test('normal content', () => {
  const result = parseTabsContent(dedent`
    ::foo
    foo

    ::bar
    bar
  `)

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "content": "foo",
        "label": "foo",
      },
      {
        "content": "bar",
        "label": "bar",
      },
    ]
  `)
})

test('content with multiple lines', () => {
  const result = parseTabsContent(dedent`
    ::foo
    foo
    foo2
  `)

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "content": "foo
    foo2",
        "label": "foo",
      },
    ]
  `)
})

test('supports space after ::', () => {
  const result = parseTabsContent(dedent`
    :: foo
    foo
  `)

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "content": "foo",
        "label": "foo",
      },
    ]
  `)
})

test('empty content', () => {
  expect(() => {
    parseTabsContent('')
  }).toThrowError('tabs should start with')
})

test('doesnt start with ::name', () => {
  expect(() => {
    parseTabsContent('foo\n::bar')
  }).toThrowError('tabs should start with')
})

test('includes same tab name', () => {
  expect(() => {
    parseTabsContent(dedent`
      ::foo
      foo

      ::foo
      bar
    `)
  }).toThrowError('already exists')
})

test('forbidden tab name', () => {
  expect(() => {
    parseTabsContent('::"foo"')
  }).toThrowError('forbidden chars')
})
