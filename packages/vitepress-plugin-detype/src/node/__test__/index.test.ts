import { createServer } from 'vitepress'
import { expect, test } from 'vitest'
import url from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const createTransform = async () => {
  const server = await createServer(path.resolve(__dirname, './fixtures'))
  await server.pluginContainer.buildStart({})
  return async (id: string) => {
    const result = await server.transformRequest(id)
    return result?.code
  }
}

const transform = await createTransform()

test('should work', async () => {
  const result = await transform('/normal.md')
  expect(result).toMatchSnapshot()
})

test('with highlight lines', async () => {
  const result = await transform('/with-highlight-lines.md')
  expect(result).toMatchSnapshot()
})

test('vue', async () => {
  const result = await transform('/vue.md')
  expect(result).toMatchSnapshot()
})
