import { expect, test } from '@jest/globals'
import * as I18NString from '../src/parts/I18NString/I18NString.ts'

test('no placeholder', () => {
  const key = 'abc'
  expect(I18NString.i18nString(key)).toBe('abc')
})

test('with placeholder', () => {
  const key = '{PH1} results'
  expect(
    I18NString.i18nString(key, {
      PH1: 2,
    }),
  ).toBe('2 results')
})
