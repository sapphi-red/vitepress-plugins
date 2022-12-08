import { test, expect } from 'vitest'
import { parseDetypeInfo } from '../parseDetypeInfo'

const cases: Array<{
  input: string
  output: ReturnType<typeof parseDetypeInfo>
}> = [
  { input: 'ts,=detype=', output: { type: 'ts', tsAttrs: '', jsAttrs: '' } },
  { input: 'tsx,=detype=', output: { type: 'tsx', tsAttrs: '', jsAttrs: '' } },
  { input: 'vue,=detype=', output: { type: 'vue', tsAttrs: '', jsAttrs: '' } },
  {
    input: 'ts{1-2,3},=detype=',
    output: { type: 'ts', tsAttrs: '{1-2,3}', jsAttrs: '' }
  },
  {
    input: 'ts,=detype{1-2,3}=',
    output: { type: 'ts', tsAttrs: '', jsAttrs: '{1-2,3}' }
  }
]

for (const testcase of cases) {
  test(`should work: ${JSON.stringify(testcase.input)}`, () => {
    expect(parseDetypeInfo(testcase.input)).toStrictEqual(testcase.output)
  })
}
