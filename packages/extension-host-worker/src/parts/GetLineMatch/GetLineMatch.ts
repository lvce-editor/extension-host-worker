import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

export const getLineMatch = (
  results: SearchResult[],
  line: string,
  lineNumber: number,
  query: string,
  queryLower: string,
  useRegularExpression: number,
  matchCase: number,
): void => {
  const lineToQuery = matchCase ? line : line.toLowerCase()
  const actualQuery = matchCase ? query : queryLower
  const index = lineToQuery.indexOf(actualQuery)
  if (index !== -1) {
    results.push({
      type: TextSearchResultType.Match,
      text: line,
      start: index,
      end: index + query.length,
      lineNumber,
    })
  }
}
