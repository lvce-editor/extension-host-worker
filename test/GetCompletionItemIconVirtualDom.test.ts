import { expect, test } from '@jest/globals'
import * as GetCompletionItemIconVirtualDom from '../src/parts/GetCompletionItemIconVirtualDom/GetCompletionItemIconVirtualDom.ts'

test('getIconDom - symbol - default', () => {
  const fileIcon = ''
  const symbolName = 'SymbolDefault'
  expect(GetCompletionItemIconVirtualDom.getIconDom(fileIcon, symbolName)).toEqual({
    type: 4,
    className: 'ColoredMaskIcon SymbolDefault',
    childCount: 0,
  })
})

test('getIconDom - fileIcon', () => {
  const fileIcon = '/test/xyz.svg'
  const symbolName = ''
  expect(GetCompletionItemIconVirtualDom.getIconDom(fileIcon, symbolName)).toEqual({
    type: 17,
    className: 'FileIcon',
    src: '/test/xyz.svg',
    role: 'none',
    childCount: 0,
  })
})
