import MarkdownIt from 'markdown-it'
import { test, expect } from 'vitest'
import { npmCommandsPlugin } from '../markdownPlugin'
import dedent from 'ts-dedent'

const setup = () => {
  const md = MarkdownIt()
  md.use(npmCommandsPlugin)
  return md
}

const s = '```'

test('render manual correctly', () => {
  const md = setup()
  const result = md.render(dedent`
    ${s}
    npm i vite // [!=npm npm]
    yarn add vite // [!=npm yarn]
    pnpm add vite // [!=npm pnpm]
    bun add vite // [!=npm bun]
    ${s}
  `)
  expect(result).toMatchSnapshot()
})

test('render auto correctly', () => {
  const md = setup()
  const result = md.render(dedent`
    ${s}
    npm i // [!=npm auto]
    ${s}
  `)
  expect(result).toMatchSnapshot()
})

test('escape hatch', () => {
  const md = setup()
  const result = md.render(dedent`
    ${s}{----npm-disable}
    npm i // [!=npm auto]
    ${s}
  `)
  expect(result).toMatchSnapshot()
})
