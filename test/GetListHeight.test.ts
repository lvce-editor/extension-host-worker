import { expect, test } from '@jest/globals'
import * as GetListHeight from '../src/parts/GetListHeight/GetListHeight.ts'

test('getListHeight - empty list', () => {
  const itemsLength = 0
  const itemHeight = 20
  const maxHeight = 200
  expect(GetListHeight.getListHeight(itemsLength, itemHeight, maxHeight)).toBe(20)
})

test('getListHeight', () => {
  const itemsLength = 1
  const itemHeight = 20
  const maxHeight = 200
  expect(GetListHeight.getListHeight(itemsLength, itemHeight, maxHeight)).toBe(20)
})
