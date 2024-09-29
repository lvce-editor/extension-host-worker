import { expect, test } from '@jest/globals'
import * as CompletionItemFlags from '../src/parts/CompletionItemFlags/CompletionItemFlags.ts'
import * as GetCompletionItemHighlights from '../src/parts/GetCompletionItemHighlights/GetCompletionItemHighlights.ts'

test('getHighlights', () => {
  const item = {
    label: 'abc',
    flags: CompletionItemFlags.None,
    matches: [8, 0, 1],
  }
  expect(GetCompletionItemHighlights.getHighlights(item)).toEqual([0, 1])
})
