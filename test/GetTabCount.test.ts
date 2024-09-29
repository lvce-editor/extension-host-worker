import { expect, test } from '@jest/globals'
import * as GetTabCount from '../src/parts/GetTabCount/GetTabCount.ts'

test('getTabCount', () => {
  const value = '\t\t'
  expect(GetTabCount.getTabCount(value)).toBe(2)
})
