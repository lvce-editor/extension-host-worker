import { expect, test } from '@jest/globals'
import * as GetVisibleCompletionItems from '../src/parts/GetVisibleCompletionItems/GetVisibleCompletionItems.ts'
import * as EditorCompletionType from '../src/parts/EditorCompletionType/EditorCompletionType.ts'

test('getVisibleCompletionItems', () => {
  const filteredItems = [
    {
      label: 'test',
      kind: EditorCompletionType.Property,
      top: 10,
      matches: [10, 0, 1],
    },
  ]
  const itemHeight = 20
  const leadingWord = 't'
  const minLineY = 0
  const maxLineY = 1
  const focusedIndex = 0
  expect(GetVisibleCompletionItems.getVisibleItems(filteredItems, itemHeight, leadingWord, minLineY, maxLineY, focusedIndex)).toEqual([
    {
      deprecated: 0,
      fileIcon: '',
      focused: true,
      highlights: [0, 1],
      label: 'test',
      symbolName: 'SymbolProperty',
      top: 0,
    },
  ])
})
