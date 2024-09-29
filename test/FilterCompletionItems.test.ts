// based on tests from https://github.com/jeancroy/fuzz-aldrin-plus/blob/84eac1d73bacbbd11978e6960f4aa89f8396c540/spec/match-spec.coffee by jeancroy (License MIT)

import { expect, test } from '@jest/globals'
import * as CompletionItemFlags from '../src/parts/CompletionItemFlags/CompletionItemFlags.ts'
import * as FilterCompletionItems from '../src/parts/FilterCompletionItems/FilterCompletionItems.ts'

test('filterCompletionItems', () => {
  const completionItems = [
    {
      label: 'abc',
      flags: CompletionItemFlags.None,
    },
  ]
  const word = 'a'
  expect(FilterCompletionItems.filterCompletionItems(completionItems, word)).toEqual([
    {
      label: 'abc',
      flags: CompletionItemFlags.None,
      matches: [8, 0, 1],
    },
  ])
})
