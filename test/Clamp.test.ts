import { expect, test } from '@jest/globals'
import * as Clamp from '../src/parts/Clamp/Clamp.ts'

test('clamp - lower bound', () => {
  const num = 5
  const min = 10
  const max = 20
  expect(Clamp.clamp(num, min, max)).toBe(10)
})
