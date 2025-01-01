import { expect, test } from '@jest/globals'
import * as GetLineMatch from '../src/parts/GetLineMatch/GetLineMatch.ts'
import { MatchCase, UseRegularExpression } from '../src/parts/SearchFlags/SearchFlags.ts'
import { SearchResult } from '../src/parts/SearchResult/SearchResult.ts'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.ts'

test('getLineMatch - plain text search', () => {
  const results: SearchResult[] = []
  GetLineMatch.getLineMatch(results, 'hello world', 1, 'hello', 'hello', 0, 0)
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

test.skip('getLineMatch - regex search', () => {
  const results: SearchResult[] = []
  GetLineMatch.getLineMatch(results, 'hello world', 1, 'h[e]llo', 'h[e]llo', UseRegularExpression, 0)
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

test('getLineMatch - case sensitive regex', () => {
  const results: SearchResult[] = []
  GetLineMatch.getLineMatch(results, 'HELLO world', 1, 'hello', 'hello', UseRegularExpression, MatchCase)
  expect(results).toEqual([])
})

test('getLineMatch - invalid regex', () => {
  const results: SearchResult[] = []
  GetLineMatch.getLineMatch(results, 'hello world', 1, '[invalid', '[invalid', UseRegularExpression, 0)
  expect(results).toEqual([])
})
