import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ClipBoard/ClipBoard.ts', () => {
  return {
    writeText: jest.fn(),
  }
})

const EditorCommandCut = await import('../src/parts/EditorCommand/EditorCommandCut.ts')

test('cut - empty selection', async () => {
  const editor = {
    selections: [0, 0, 0, 0],
    lines: ['a'],
    undoStack: [],
  }
  const newEditor = await EditorCommandCut.cut(editor)
  expect(newEditor.lines).toEqual([''])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 0]))
})

test('cut - selection', async () => {
  const editor = {
    selections: [0, 0, 0, 1],
    lines: ['a'],
    undoStack: [],
  }
  const newEditor = await EditorCommandCut.cut(editor)
  expect(newEditor.lines).toEqual([''])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 1]))
})
