import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

export const getLineMatchText = (line: string, lineNumber: number, query: string, queryLower: string, matchCase: number): readonly SearchResult[] => {
  const lineToQuery = matchCase ? line : line.toLowerCase()
  const actualQuery = matchCase ? query : queryLower
  const index = lineToQuery.indexOf(actualQuery)
  if (index !== -1) {
    return [
      {
        type: TextSearchResultType.Match,
        text: line,
        start: index,
        end: index + query.length,
        lineNumber,
      },
    ]
  }
  return []
}
