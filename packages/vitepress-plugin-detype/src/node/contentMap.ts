import { createHash } from 'node:crypto'

type ResultOrError = { result: string } | { error: unknown }

export type ContentMap = {
  /**
   * @returns key
   */
  add(
    frontmatter: string,
    inputValue: string,
    outputContent: Promise<ResultOrError>
  ): string
  get(key: string): Promise<ResultOrError | undefined>
}

export const createContentMap = (): ContentMap => {
  const map = new Map<string, Promise<ResultOrError>>()

  return {
    add(frontmatter, input, output) {
      const key = generateKey(`${frontmatter}_${input}`)
      if (!map.has(key)) {
        map.set(key, output)
      }
      return key
    },
    async get(key) {
      const val = map.get(key)
      return val
    }
  }
}

const generateKey = (value: string) => {
  const hash = createHash('md5').update(value).digest('hex')
  return `#_#_${hash}_#_#`
}

export const contentMapKeyRE = /#_#_[0-9a-fA-F]{32}_#_#/g
