import * as GetLineMatch from '../GetLineMatch/GetLineMatch.ts'
import { MatchCase, UseRegularExpression } from '../SearchFlags/SearchFlags.ts'
import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

export const textSearchInText = (file: string, content: string, query: string, flags: number = 0): readonly SearchResult[] => {
  const matchCase = flags & MatchCase
  const useRegularExpression = flags & UseRegularExpression
  const results: SearchResult[] = []
  const lines = SplitLines.splitLines(content)
  const queryLower = query.toLowerCase()
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    GetLineMatch.getLineMatch(results, line, i, query, queryLower, useRegularExpression, matchCase)
  }
  if (results.length > 0) {
    results.unshift({
      type: TextSearchResultType.File,
      text: file,
      start: 0,
      end: 0,
      lineNumber: 0,
    })
  }
  return results
}
