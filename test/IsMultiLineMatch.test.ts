import { expect, test } from '@jest/globals'
import * as IsMultiLineMatch from '../src/parts/IsMultiLineMatch/IsMultiLineMatch.ts'

test('match', () => {
  const lines: readonly string[] = ['a', 'b']
  const rowIndex = 0
  const wordParts = ['a', 'b']
  expect(IsMultiLineMatch.isMultiLineMatch(lines, rowIndex, wordParts)).toBe(true)
})

test('mismatch at start', () => {
  const lines: readonly string[] = ['a', 'b']
  const rowIndex = 0
  const wordParts = ['c']
  expect(IsMultiLineMatch.isMultiLineMatch(lines, rowIndex, wordParts)).toBe(false)
})

test('mismatch in middle', () => {
  const lines: readonly string[] = ['a', 'b', 'c']
  const rowIndex = 0
  const wordParts = ['a', 'c']
  expect(IsMultiLineMatch.isMultiLineMatch(lines, rowIndex, wordParts)).toBe(false)
})

test('mismatch at end', () => {
  const lines: readonly string[] = ['a', 'b', 'c']
  const rowIndex = 0
  const wordParts = ['a', 'b', 'd']
  expect(IsMultiLineMatch.isMultiLineMatch(lines, rowIndex, wordParts)).toBe(false)
})
