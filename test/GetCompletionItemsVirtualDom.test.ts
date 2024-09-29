import { expect, test } from '@jest/globals'
import * as GetCompletionItemsVirtualDom from '../src/parts/GetCompletionItemsVirtualDom/GetCompletionItemsVirtualDom.ts'

test('getCompletionItemsVirtualDom - empty', () => {
  const visibleItems: any[] = []
  expect(GetCompletionItemsVirtualDom.getCompletionItemsVirtualDom(visibleItems)).toEqual([
    {
      childCount: 1,
      type: 4,
    },
    {
      childCount: 0,
      text: 'No Results',
      type: 12,
    },
  ])
})

test('getCompletionItemsVirtualDom', () => {
  const visibleItems: any[] = [
    {
      top: 0,
      label: 'test',
      symbolName: 'test',
      highlights: [],
      focused: true,
      deprecated: true,
      fileIcon: '',
    },
  ]
  expect(GetCompletionItemsVirtualDom.getCompletionItemsVirtualDom(visibleItems)).toEqual([
    {
      childCount: 1,
      type: 4,
    },
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
