import { expect, test } from '@jest/globals'
import * as ScrollBarFunctions from '../src/parts/ScrollBarFunctions/ScrollBarFunctions.ts'

test('getNewDeltaPercent - clicked at top', () => {
  const height = 100
  const scrollBarHeight = 20
  const relativeY = 1
  expect(ScrollBarFunctions.getNewDeltaPercent(height, scrollBarHeight, relativeY)).toEqual({
    percent: 0,
    handleOffset: 1,
  })
})

test('getNewDeltaPercent - clicked in middle', () => {
  const height = 100
  const scrollBarHeight = 20
  const relativeY = 20
  expect(ScrollBarFunctions.getNewDeltaPercent(height, scrollBarHeight, relativeY)).toEqual({
    percent: 0.125,
    handleOffset: 10,
  })
})

test('getNewDeltaPercent - clicked at bottom', () => {
  const height = 100
  const scrollBarHeight = 20
  const relativeY = 91
  expect(ScrollBarFunctions.getNewDeltaPercent(height, scrollBarHeight, relativeY)).toEqual({
    percent: 1,
    handleOffset: 11,
  })
})
