import { expect, test } from '@jest/globals'
import * as GetScrollBarWidth from '../src/parts/GetScrollBarWidth/GetScrollBarWidth.ts'

test('getScrollBarWidth - no scrollbar needed', () => {
  const width = 100
  const longestLineWidth = 50
  expect(GetScrollBarWidth.getScrollBarWidth(width, longestLineWidth)).toBe(0)
})

test('getScrollBarWidth - with scrollbar', () => {
  const width = 50
  const longestLineWidth = 100
  expect(GetScrollBarWidth.getScrollBarWidth(width, longestLineWidth)).toBe(25)
})
