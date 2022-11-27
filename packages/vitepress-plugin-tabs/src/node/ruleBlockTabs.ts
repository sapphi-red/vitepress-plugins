/**!
 * based on https://github.com/markdown-it/markdown-it/blob/2b6cac25823af011ff3bc7628bc9b06e483c5a08/lib/rules_block/fence.js
 *
 * MIT License
 * Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
 * https://github.com/markdown-it/markdown-it/blob/master/LICENSE
 */

import type { RuleBlock } from 'markdown-it/lib/parser_block'

const tabsMarker = '=tabs'
const tabsMarkerLen = tabsMarker.length

export const ruleBlockTabs: RuleBlock = (state, startLine, endLine, silent) => {
  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false
  }

  let pos = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]
  if (pos + 3 > max) {
    return false
  }

  const marker = state.src.charCodeAt(pos)
  if (marker !== 0x3a /* : */) {
    return false
  }

  // scan marker length
  const mem = pos
  pos = state.skipChars(pos, marker)

  let len = pos - mem
  if (len < 3) {
    return false
  }

  if (state.src.slice(pos, pos + tabsMarkerLen) !== tabsMarker) {
    return false
  }
  pos += tabsMarkerLen

  // Since start is found, we can report success here in validation mode
  if (silent) {
    return true
  }

  const markup = state.src.slice(mem, pos)
  const params = state.src.slice(pos, max)

  // search end of block
  let nextLine = startLine
  let haveEndMarker = false

  for (;;) {
    nextLine++
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break
    }

    pos = state.bMarks[nextLine] + state.tShift[nextLine]
    const mem = pos
    max = state.eMarks[nextLine]

    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break
    }

    if (state.src.charCodeAt(pos) !== marker) {
      continue
    }

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue
    }

    pos = state.skipChars(pos, marker)

    // closing code fence must be at least as long as the opening one
    if (pos - mem < len) {
      continue
    }

    // make sure tail has spaces only
    pos = state.skipSpaces(pos)

    if (pos < max) {
      continue
    }

    haveEndMarker = true
    // found!
    break
  }

  // If a fence has heading spaces, they should be removed from its inner block
  len = state.sCount[startLine]

  state.line = nextLine + (haveEndMarker ? 1 : 0)

  const token = state.push('tabs', 'div', 0)
  token.info = params
  token.content = state.getLines(startLine + 1, nextLine, len, true)
  token.markup = markup
  token.map = [startLine, state.line]

  return true
}
