import { expect, test } from '@jest/globals'
import * as GetHighlightedLabelDom from '../src/parts/GetHighlightedLabelDom/GetHighlightedLabelDom.ts'

test('getHighlightedLabelDom - highlight at start', () => {
  const label = 'test'
  const highlights = [0, 1]
  expect(GetHighlightedLabelDom.getHighlightedLabelDom(label, highlights)).toEqual([
    {
      childCount: 2,
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
      text: 't',
      type: 12,
    },
    {
      childCount: 0,
      text: 'est',
      type: 12,
    },
  ])
})

test('getHighlightedLabelDom - highlight in the middle start', () => {
  const label = 'test'
  const highlights = [1, 2]
  expect(GetHighlightedLabelDom.getHighlightedLabelDom(label, highlights)).toEqual([
    {
      childCount: 3,
      className: 'Label',
      type: 4,
    },
    {
      childCount: 0,
      text: 't',
      type: 12,
    },
    {
      childCount: 1,
      className: 'EditorCompletionItemHighlight',
      type: 8,
    },
    {
      childCount: 0,
      text: 'e',
      type: 12,
    },
    {
      childCount: 0,
      text: 'st',
      type: 12,
    },
  ])
})

test('getHighlightedLabelDom - no highlights', () => {
  const label = 'test'
  const highlights: number[] = []
  expect(GetHighlightedLabelDom.getHighlightedLabelDom(label, highlights)).toEqual([
    {
      childCount: 1,
      className: 'Label',
      type: 4,
    },
    { childCount: 0, text: 'test', type: 12 },
  ])
})
