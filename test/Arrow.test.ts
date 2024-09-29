import { expect, test } from '@jest/globals'
import * as Arrow from '../src/parts/Arrow/Arrow.ts'

test('diagonal', () => {
  expect(Arrow.Diagonal).toBe(1)
})

test('left', () => {
  expect(Arrow.Left).toBe(2)
})
