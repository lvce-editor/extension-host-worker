import { expect, test } from '@jest/globals'
import * as GetY from '../src/parts/GetY/GetY.ts'

test('getY', () => {
  const row = 2
  const minLineY = 1
  const rowHeight = 20
  expect(GetY.getY(row, minLineY, rowHeight)).toBe(20)
})
