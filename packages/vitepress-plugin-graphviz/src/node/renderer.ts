import { Graphviz } from '@hpcc-js/wasm-graphviz'

let graphviz: Awaited<ReturnType<typeof Graphviz.load>> | null = null

export async function initGraphviz(): Promise<void> {
  graphviz ??= await Graphviz.load()
}

export function getGraphvizVersion(): string {
  if (!graphviz) throw new Error('Graphviz not initialized. Call initGraphviz() first.')
  return graphviz.version()
}

export function renderDot(dot: string): string {
  if (!graphviz) throw new Error('Graphviz not initialized. Call initGraphviz() first.')
  return graphviz.dot(dot, 'svg_inline')
}
