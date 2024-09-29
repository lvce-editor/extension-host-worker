import { expect, test } from '@jest/globals'
import * as GetCompletionItemVirtualDom from '../src/parts/GetCompletionItemVirtualDom/GetCompletionItemVirtualDom.ts'

test('focused', () => {
  const visibleItem = {
    top: 0,
    label: 'test',
    symbolName: 'test',
    highlights: [],
    focused: true,
    deprecated: true,
    fileIcon: '',
  }
  expect(GetCompletionItemVirtualDom.getCompletionItemVirtualDom(visibleItem)).toEqual([
    {
      childCount: 2,
      className: 'EditorCompletionItem EditorCompletionItemFocused EditorCompletionItemDeprecated',
      role: 'option',
      top: 0,
      type: 4,
    },
    {
      childCount: 0,
      className: 'ColoredMaskIcon test',
      type: 4,
    },
    {
      childCount: 1,
      className: 'Label',
      type: 4,
    },
    {
      childCount: 0,
      text: 'test',
      type: 12,
    },
  ])
})
