export type FenceAttrs = Record<string, string>

const ATTR_RE = /(\w+)=(?:"([^"]*)"|([\w.-]+))|(\w+)/g

export function parseFenceAttrs(raw: string | undefined): FenceAttrs {
  if (!raw) return {}

  const attrs: FenceAttrs = {}
  for (const m of raw.matchAll(ATTR_RE)) {
    if (m[1]) {
      // key=value or key="quoted value"
      attrs[m[1]] = m[2] ?? m[3]
    } else if (m[4]) {
      // bare flag
      attrs[m[4]] = 'true'
    }
  }
  return attrs
}
