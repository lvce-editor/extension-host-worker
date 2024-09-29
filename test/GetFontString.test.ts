import { expect, test } from '@jest/globals'
import * as GetFontString from '../src/parts/GetFontString/GetFontString.ts'

test('getFontString', () => {
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  expect(GetFontString.getFontString(fontWeight, fontSize, fontFamily)).toBe(`400 16px test font`)
})
