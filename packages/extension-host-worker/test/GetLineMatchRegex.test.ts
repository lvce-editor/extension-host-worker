import { expect, test } from '@jest/globals'
import * as GetLineMatchRegex from '../src/parts/GetLineMatchRegex/GetLineMatchRegex.ts'
import { MatchCase } from '../src/parts/SearchFlags/SearchFlags.ts'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.ts'

test('getLineMatchRegex - basic regex match', () => {
  const results = GetLineMatchRegex.getLineMatchRegex('hello world', 1, 'h[e]llo', 0)
  expect(results).toEqual([
    {
      type: TextSearchResultType.Match,
      text: 'hello world',
      start: 0,
      end: 5,
      lineNumber: 1,
    },
  ])
})

test('getLineMatchRegex - case insensitive match', () => {
  const results = GetLineMatchRegex.getLineMatchRegex('HELLO world', 1, 'hello', 0)
  expect(results).toEqual([
    {
      type: TextSearchResultType.Match,
      text: 'HELLO world',
      start: 0,
      end: 5,
      lineNumber: 1,
    },
  ])
})

test('getLineMatchRegex - case sensitive no match', () => {
  const results = GetLineMatchRegex.getLineMatchRegex('HELLO world', 1, 'hello', MatchCase)
  expect(results).toEqual([])
})

test.skip('getLineMatchRegex - invalid regex', () => {
  const results = GetLineMatchRegex.getLineMatchRegex('hello world', 1, '[invalid', 0)
  expect(results).toEqual([])
})

test('getLineMatchRegex - no match', () => {
  const results = GetLineMatchRegex.getLineMatchRegex('hello world', 1, 'xyz', 0)
  expect(results).toEqual([])
})
