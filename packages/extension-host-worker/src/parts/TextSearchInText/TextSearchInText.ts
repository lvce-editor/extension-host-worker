import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as GetLineMatch from '../GetLineMatch/GetLineMatch.ts'
import { MatchCase, MatchWholeWord, UseRegularExpression } from '../SearchFlags/SearchFlags.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

export const textSearchInText = (file: string, content: string, query: string, flags: number = 0): readonly SearchResult[] => {
  const matchCase = flags & MatchCase
  const useRegularExpression = flags & UseRegularExpression
  const matchWholeWord = flags & MatchWholeWord
  const lines = SplitLines.splitLines(content)
  const queryLower = query.toLowerCase()
  const results = lines.flatMap((line, i) => GetLineMatch.getLineMatch(line, i, query, queryLower, useRegularExpression, matchCase, matchWholeWord))

  if (results.length > 0) {
    return [
      {
        end: 0,
        lineNumber: 0,
        start: 0,
        text: file,
        type: TextSearchResultType.File,
      },
      ...results,
    ]
  }
  return results
}
