import MarkdownIt from 'markdown-it'
import { describe, test, expect } from 'vitest'
import { tabsPlugin } from '../markdownPlugin'
import dedent from 'ts-dedent'
import container from 'markdown-it-container'

const setup = ({
  withTipContainer = false,
}: { withTipContainer?: boolean } = {}) => {
  const md = MarkdownIt()
  md.use(tabsPlugin)
  if (withTipContainer) {
    md.use(container, 'tip')
  }
  return md
}

describe('render correctly', () => {
  const md = setup()

  const inputs = [
    dedent`
      :::tabs
      == Tab "A"
      a
      == Tab "B"
      b
      :::
    `,
    dedent`
      ::::tabs
      === Tab "A"
      a
      === Tab "B"
      b
      ::::
    `,
    dedent`
      :::tabs
      == Tab "A"
      a
      == Tab "B"
      b
    `,
  ]

  test.each(inputs)('input', (input) => {
    const result = md.render(input)
    expect(result).toMatchSnapshot()
  })
})

test('render tab with nested ::: code correctly', () => {
  const md = setup()
  const result = md.render(dedent`
    :::tabs
    == Tab "A"
    a
    \`\`\`js
    const foo = ':::';
    \`\`\`
    == Tab "B"
    b
    :::
  `)
  expect(result).toMatchSnapshot()
})

describe('render tab with nested block correctly', () => {
  const md = setup({ withTipContainer: true })

  const inputs = [
    dedent`
      :::: tabs
      == Tab "A"
      a
      :::tip
      Tip
      :::
      == Tab "B"
      b
      ::::
    `,
    dedent`
      :::: tabs
      == Tab "A"
      a
      :::tip
      Tip
      == Tab "B"
      :::
      == Tab "C"
      c
      ::::
    `,
    dedent`
      :::: tabs
      === Tab "A"
      a
      :::tip
      Tip
      == t
      :::
      === Tab "B"
      b
      ::::
    `,
  ]

  test.each(inputs)('input', (input) => {
    const result = md.render(input)
    expect(result).toMatchSnapshot()
  })
})
