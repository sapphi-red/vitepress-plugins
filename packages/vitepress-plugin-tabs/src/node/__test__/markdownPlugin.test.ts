import MarkdownIt from 'markdown-it'
import { test, expect } from 'vitest'
import { tabsPlugin } from '../markdownPlugin'
import dedent from 'ts-dedent'

const setup = () => {
  const md = MarkdownIt()
  md.use(tabsPlugin)
  return md
}

test('render correctly', () => {
  const md = setup()
  const result = md.render(dedent`
    :::=tabs
    ::a
    a
    ::b
    b
    :::
  `)
  expect(result).toMatchSnapshot()
})
