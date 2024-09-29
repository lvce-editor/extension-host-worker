import { expect, test } from '@jest/globals'
import * as EditorScrolling from '../src/parts/EditorScrolling/EditorScrolling.ts'

test('setDeltaY - same value', () => {
  const editor = {
    finalDeltaY: 0,
    deltaY: 0,
    numberOfVisibleLines: 0,
    height: 0,
    scrollBarHeight: 0,
    itemHeight: 0,
  }
  const value = 0
  expect(EditorScrolling.setDeltaY(editor, value)).toBe(editor)
})

test('setDeltaY - scroll down', () => {
  const editor = {
    finalDeltaY: 400,
    deltaY: 1,
    numberOfVisibleLines: 20,
    height: 400,
    scrollBarHeight: 0,
    itemHeight: 20,
  }
  const value = 100
  expect(EditorScrolling.setDeltaY(editor, value)).toEqual({
    finalDeltaY: 400,
    numberOfVisibleLines: 20,
    height: 400,
    scrollBarHeight: 0,
    itemHeight: 20,
    deltaY: 100,
    maxLineY: 25,
    minLineY: 5,
    scrollBarY: 100,
  })
})
