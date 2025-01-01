import { expect, test } from '@jest/globals'
import * as GetLineMatchText from '../src/parts/GetLineMatchText/GetLineMatchText.ts'
import { MatchCase } from '../src/parts/SearchFlags/SearchFlags.ts'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.ts'

test('getLineMatchText - basic match', () => {
  const results = GetLineMatchText.getLineMatchText('hello world', 1, 'hello', 'hello', 0)
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

test('getLineMatchText - case insensitive match', () => {
  const results = GetLineMatchText.getLineMatchText('HELLO world', 1, 'hello', 'hello', 0)
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

test('getLineMatchText - case sensitive no match', () => {
  const results = GetLineMatchText.getLineMatchText('HELLO world', 1, 'hello', 'hello', MatchCase)
  expect(results).toEqual([])
})

test('getLineMatchText - no match', () => {
  const results = GetLineMatchText.getLineMatchText('hello world', 1, 'xyz', 'xyz', 0)
  expect(results).toEqual([])
})
