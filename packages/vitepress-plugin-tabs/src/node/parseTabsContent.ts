const tabBreakRE = /^\s*::(.+)$/
const forbiddenCharsInSlotNames = /[ '"]/
const parseTabBreakLine = (line: string) => {
  const m = line.match(tabBreakRE)
  if (!m) return null
  const trimmed = m[1].trim()
  if (forbiddenCharsInSlotNames.test(trimmed)) {
    throw new Error(
      `contains forbidden chars in slot names (space and quotes) (${JSON.stringify(
        line
      )})`
    )
  }
  return trimmed
}

type TabInfo = { label: string; content: string[] }

const lastLineBreakRE = /\n$/

export const parseTabsContent = (content: string) => {
  const lines = content.replace(lastLineBreakRE, '').split('\n')

  const tabInfos: TabInfo[] = []
  const tabLabels = new Set<string>()
  let currentTab: TabInfo | null = null
  const createTabInfo = (label: string) => {
    if (tabLabels.has(label)) {
      throw new Error(`a tab labelled ${JSON.stringify(label)} already exists`)
    }

    const newTab = { label, content: [] }
    tabInfos.push(newTab)
    tabLabels.add(label)
    return newTab
  }

  for (const line of lines) {
    const tabLabel = parseTabBreakLine(line)

    if (currentTab === null) {
      if (tabLabel === null) {
        throw new Error(
          `tabs should start with \`::$\{tabLabel}\` (e.g. "::foo"). (received: ${JSON.stringify(
            line
          )})`
        )
      }
      currentTab = createTabInfo(tabLabel)
      continue
    }

    if (tabLabel === null) {
      currentTab.content.push(line)
    } else {
      currentTab = createTabInfo(tabLabel)
    }
  }

  if (tabInfos.length < 0) {
    throw new Error('tabs should include at least one tab')
  }

  return tabInfos.map(info => ({
    label: info.label,
    content: info.content.join('\n').replace(lastLineBreakRE, '')
  }))
}
