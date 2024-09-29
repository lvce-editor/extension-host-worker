import { expect, test } from '@jest/globals'
import * as EditorCursorWordRight from '../src/parts/EditorCommand/EditorCommandCursorWordRight.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('basic', () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  const newEditor1 = EditorCursorWordRight.cursorWordRight(editor)
  expect(newEditor1.selections).toEqual(new Uint32Array([0, 1, 0, 1]))
})

test('editorCursorWordRight', () => {
  const editor = {
    lines: ['    <title>Document</title>'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  const newEditor1 = EditorCursorWordRight.cursorWordRight(editor)
  expect(newEditor1).toMatchObject({
    selections: EditorSelection.fromRange(0, 10, 0, 10),
  })
  const newEditor3 = EditorCursorWordRight.cursorWordRight(newEditor1)
  expect(newEditor3).toMatchObject({
    selections: EditorSelection.fromRange(0, 19, 0, 19),
  })
  const newEditor4 = EditorCursorWordRight.cursorWordRight(newEditor3)
  expect(newEditor4).toMatchObject({
    selections: EditorSelection.fromRange(0, 26, 0, 26),
  })
  const newEditor5 = EditorCursorWordRight.cursorWordRight(newEditor4)
  expect(newEditor5).toMatchObject({
    selections: EditorSelection.fromRange(0, 27, 0, 27),
  })
})

test('editorCursorWordRight - with dots', () => {
  const editor = {
    lines: ['this.is.a.test'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  const newEditor1 = EditorCursorWordRight.cursorWordRight(editor)
  expect(newEditor1).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
  const newEditor2 = EditorCursorWordRight.cursorWordRight(newEditor1)
  expect(newEditor2).toMatchObject({
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
  const newEditor3 = EditorCursorWordRight.cursorWordRight(newEditor2)
  expect(newEditor3).toMatchObject({
    selections: EditorSelection.fromRange(0, 9, 0, 9),
  })
  const newEditor4 = EditorCursorWordRight.cursorWordRight(newEditor3)
  expect(newEditor4).toMatchObject({
    selections: EditorSelection.fromRange(0, 14, 0, 14),
  })
})

test.skip('editorCursorWordRight - with selection', () => {
  const editor = {
    lines: ['<title>Document</title>'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  }
  const newEditor1 = EditorCursorWordRight.cursorWordRight(editor)
  expect(newEditor1).toMatchObject({
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test('editorCursorWordRight - at end of line', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  }
  const newEditor1 = EditorCursorWordRight.cursorWordRight(editor)
  expect(newEditor1).toMatchObject({
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})
