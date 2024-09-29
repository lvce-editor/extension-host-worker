import { expect, test } from '@jest/globals'
import * as Px from '../src/parts/Px/Px.ts'

test('px', () => {
  const value = 1
  expect(Px.px(value)).toBe('1px')
})

test('position', () => {
  const x = 1
  const y = 1
  expect(Px.position(x, y)).toBe('1px 1px')
})
