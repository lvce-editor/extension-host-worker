import { expect, test } from '@jest/globals'
import * as GetLineMatchText from '../src/parts/GetLineMatchText/GetLineMatchText.ts'
import { MatchCase, MatchWholeWord } from '../src/parts/SearchFlags/SearchFlags.ts'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.ts'

test('getLineMatchText - basic match', () => {
  const results = GetLineMatchText.getLineMatchText('hello world', 1, 'hello', 'hello', 0, 0)
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
  const results = GetLineMatchText.getLineMatchText('HELLO world', 1, 'hello', 'hello', 0, 0)
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

test('getLineMatchText - match whole word, no match', () => {
  const results = GetLineMatchText.getLineMatchText('test', 1, 'st', 'st', 0, MatchWholeWord)
  expect(results).toEqual([])
})

test('getLineMatchText - match whole word, match at start of line', () => {
  const results = GetLineMatchText.getLineMatchText('test', 1, 'test', 'test', 0, MatchWholeWord)
  expect(results).toEqual([
    {
      end: 4,
      lineNumber: 1,
      start: 0,
      text: 'test',
      type: 2,
    },
  ])
})

test('getLineMatchText - match whole word, match before space', () => {
  const results = GetLineMatchText.getLineMatchText(' test', 1, 'test', 'test', 0, MatchWholeWord)
  expect(results).toEqual([
    {
      end: 5,
      lineNumber: 1,
      start: 1,
      text: ' test',
      type: 2,
    },
  ])
})

test('getLineMatchText - match whole word, match before tab', () => {
  const results = GetLineMatchText.getLineMatchText('\ttest', 1, 'test', 'test', 0, MatchWholeWord)
  expect(results).toEqual([
    {
      end: 5,
      lineNumber: 1,
      start: 1,
      text: '\ttest',
      type: 2,
    },
  ])
})

test('getLineMatchText - match whole word, match before dash', () => {
  const results = GetLineMatchText.getLineMatchText('-test', 1, 'test', 'test', 0, MatchWholeWord)
  expect(results).toEqual([
    {
      end: 5,
      lineNumber: 1,
      start: 1,
      text: '-test',
      type: 2,
    },
  ])
})

test('getLineMatchText - case sensitive no match', () => {
  const results = GetLineMatchText.getLineMatchText('HELLO world', 1, 'hello', 'hello', MatchCase, 0)
  expect(results).toEqual([])
})

test('getLineMatchText - no match', () => {
  const results = GetLineMatchText.getLineMatchText('hello world', 1, 'xyz', 'xyz', 0, 0)
  expect(results).toEqual([])
})
