import { expect, test } from '@jest/globals'
import * as EditorCompletionRender from '../src/parts/EditorCompletionRender/EditorCompletionRender.ts'

test('renderCompletion', () => {
  const oldState = {
    items: [
      {
        label: 'a',
        matches: [10, 0, 1],
      },
    ],
    itemHeight: 20,
    minLineY: 0,
    maxLineY: 1,
    focusedIndex: 0,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    deltaY: 0,
  }
  const newState = {
    items: [
      {
        label: 'b',
        matches: [10, 0, 1],
      },
      {
        label: 'c',
        matches: [10, 0, 1],
      },
    ],
    itemHeight: 20,
    minLineY: 0,
    maxLineY: 1,
    focusedIndex: 0,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    deltaY: 1,
  }
  expect(EditorCompletionRender.renderCompletion(oldState, newState)).toEqual([
    [
      'setDom',
      [
        {
          childCount: 1,
          type: 4,
        },
        {
          childCount: 2,
          className: 'EditorCompletionItem EditorCompletionItemFocused',
          role: 'option',
          top: 0,
          type: 4,
        },
        {
          childCount: 0,
          className: 'ColoredMaskIcon SymbolDefault',
          type: 4,
        },
        {
          childCount: 1,
          className: 'Label',
          type: 4,
        },
        {
          childCount: 1,
          className: 'EditorCompletionItemHighlight',
          type: 8,
        },
        {
          childCount: 0,
          text: 'b',
          type: 12,
        },
      ],
    ],
    ['setBounds', 0, 0, 100, 100],
    ['setContentHeight', 40],
    ['setNegativeMargin', -1],
    ['setScrollBar', NaN, 0],
  ])
})
