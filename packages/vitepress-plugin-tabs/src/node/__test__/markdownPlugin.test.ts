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
    ::::tabs
    :::tab Tab "A"
    a
    :::
    :::tab Tab "B"
    b
    :::
    ::::
  `)
  expect(result).toMatchSnapshot()
})

test('render tab with nested ::: code correctly', () => {
  const md = setup()
  const result = md.render(dedent`
    ::::tabs
    :::tab Tab "A"
    a
    \`\`\`js
    const foo = ':::';
    \`\`\`
    :::
    :::tab Tab "B"
    b
    :::
    ::::
  `)
  expect(result).toMatchSnapshot()
})

test('render tab with nested block correctly', () => {
  const md = setup()
  const result = md.render(dedent`
    ::::: tabs
    :::: tab Tab "A"
    a
    :::tip
    Tip
    :::
    ::::
    :::: tab Tab "B"
    b
    ::::
    :::::
  `)
  expect(result).toMatchSnapshot()
})
