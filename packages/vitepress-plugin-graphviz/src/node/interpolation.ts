export function interpolateTheme(dot: string, mode: 'light' | 'dark'): string {
  const PLACEHOLDER = '\x00ESC_DOLLAR\x00'
  let result = dot.replaceAll('$${', PLACEHOLDER)
  result = result.replace(/\$\{([^|}]*)\|([^}]*)\}/g, (_match, light: string, dark: string) =>
    mode === 'light' ? light : dark,
  )
  return result.replaceAll(PLACEHOLDER, '${')
}
