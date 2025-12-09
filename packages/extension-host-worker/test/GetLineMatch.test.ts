import { expect, test } from '@jest/globals'
import * as GetLineMatch from '../src/parts/GetLineMatch/GetLineMatch.ts'
import { MatchCase, UseRegularExpression } from '../src/parts/SearchFlags/SearchFlags.ts'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.ts'

test('getLineMatch - plain text search', () => {
  const results = GetLineMatch.getLineMatch('hello world', 1, 'hello', 'hello', 0, 0, 0)
  expect(results).toEqual([
    {
      end: 5,
      lineNumber: 1,
      start: 0,
      text: 'hello world',
      type: TextSearchResultType.Match,
    },
  ])
})

test.skip('getLineMatch - regex search', () => {
  const results = GetLineMatch.getLineMatch('hello world', 1, 'h[e]llo', 'h[e]llo', UseRegularExpression, 0, 0)
  expect(results).toEqual([
    {
      end: 5,
      lineNumber: 1,
      start: 0,
      text: 'hello world',
      type: TextSearchResultType.Match,
    },
  ])
})

test('getLineMatch - case sensitive regex', () => {
  const results = GetLineMatch.getLineMatch('HELLO world', 1, 'hello', 'hello', UseRegularExpression, MatchCase, 0)
  expect(results).toEqual([])
})

test.skip('getLineMatch - invalid regex', () => {
  const results = GetLineMatch.getLineMatch('hello world', 1, '[invalid', '[invalid', UseRegularExpression, 0, 0)
  expect(results).toEqual([])
})
