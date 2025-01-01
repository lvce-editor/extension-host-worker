import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as GetTextSearchRegex from '../GetTextSearchRegex/GetTextSearchRegex.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

export const getLineMatchRegex = (line: string, lineNumber: number, query: string, matchCase: number): readonly SearchResult[] => {
  try {
    const regex = GetTextSearchRegex.getTextSearchRegex(query, matchCase)
    const match = line.match(regex)
    if (match && typeof match.index === 'number') {
      return [
        {
          type: TextSearchResultType.Match,
          text: line,
          start: match.index,
          end: match.index + match[0].length,
          lineNumber,
        },
      ]
    }
  } catch {
    // Invalid regex pattern - return empty array
  }
  return []
}
