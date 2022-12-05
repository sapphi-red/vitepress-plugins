const detypeInfoRE = /^(tsx?|vue)({[^}]*})?,=detype({[^}]*})?=$/
const supportedTypes = ['ts', 'tsx', 'vue'] as const
export type SupportedType = typeof supportedTypes[number]

function assertType(type: string): asserts type is SupportedType {
  if (!(supportedTypes as readonly string[]).includes(type)) {
    throw new Error(
      `detype does not support type ${JSON.stringify(
        type
      )} (supported: ${supportedTypes.join(', ')})`
    )
  }
}

export const parseDetypeInfo = (info: string) => {
  const m = info.trim().match(detypeInfoRE)
  if (!m) {
    return null
  }

  const [, type, tsAttrs = '', jsAttrs = ''] = m
  assertType(type)

  return {
    type,
    tsAttrs,
    jsAttrs
  }
}
