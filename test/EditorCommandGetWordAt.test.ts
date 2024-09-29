import { expect, test } from '@jest/globals'
import * as EditorCommandGetWordAt from '../src/parts/EditorCommand/EditorCommandGetWordAt.ts'

test('getWordAt', () => {
  const editor = {
    lines: ['a'],
  }
  const rowIndex = 0
  const columnIndex = 0
  expect(EditorCommandGetWordAt.getWordAt(editor, rowIndex, columnIndex)).toEqual({
    word: 'a',
  })
})

test('EditorCommandgetWordAt', () => {
  const editor = {
    lines: ['a'],
  }
  const rowIndex = 0
  const columnIndex = 1
  expect(EditorCommandGetWordAt.getWordBefore(editor, rowIndex, columnIndex)).toEqual('a')
})
