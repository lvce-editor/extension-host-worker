import { expect, test } from '@jest/globals'
import * as GetVisibleCompletionItem from '../src/parts/GetVisibleCompletionItem/GetVisibleCompletionItem.ts'
import * as EditorCompletionType from '../src/parts/EditorCompletionType/EditorCompletionType.ts'

test('getVisibleCompletionItem', () => {
  const visibleItem = {
    label: 'test',
    kind: EditorCompletionType.Property,
    top: 10,
    matches: [10, 0, 1],
  }
  const itemHeight = 20
  const leadingWord = 't'
  const i = 0
  const focusedIndex = 0
  expect(GetVisibleCompletionItem.getVisibleIem(visibleItem, itemHeight, leadingWord, i, focusedIndex)).toEqual({
    deprecated: 0,
    fileIcon: '',
    focused: true,
    highlights: [0, 1],
    label: 'test',
    symbolName: 'SymbolProperty',
    top: 0,
  })
})
