import { expect, test } from '@jest/globals'
import * as GetLetterSpacingString from '../src/parts/GetLetterSpacingString/GetLetterSpacingString.ts'

test('getLetterSpacingString', () => {
  const letterSpacing = 5
  expect(GetLetterSpacingString.getLetterSpacingString(letterSpacing)).toBe('5px')
})
