import { expect, test } from '@jest/globals'
import * as NormalizeText from '../src/parts/NormalizeText/NormalizeText.ts'

test('normalizeText - replace tab', () => {
  const text = 'abc\tdef'
  const normalize = true
  const tabSize = 2
  expect(NormalizeText.normalizeText(text, normalize, tabSize)).toBe('abc  def')
})

test('normalizeText - ignore', () => {
  const text = 'abc def'
  const normalize = false
  const tabSize = 2
  expect(NormalizeText.normalizeText(text, normalize, tabSize)).toBe('abc def')
})
