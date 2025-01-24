import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

const doesMatchWord = (line: string, index: number, wordBoundaries: readonly string[]): boolean => {
  if (index === 0) {
    return true
  }
  const char = line.charAt(index - 1)
  return wordBoundaries.includes(char)
}

export const getLineMatchText = (
  line: string,
  lineNumber: number,
  query: string,
  queryLower: string,
  matchCase: number,
  matchWholeWord: number,
): readonly SearchResult[] => {
  // TODO support multiple matches per line
  const lineToQuery = matchCase ? line : line.toLowerCase()
  const actualQuery = matchCase ? query : queryLower
  const index = lineToQuery.indexOf(actualQuery)
  if (index === -1) {
    return []
  }
  const wordBoundaries = [' ', '\t', '-']
  if (matchWholeWord && !doesMatchWord(line, index, wordBoundaries)) {
    return []
  }
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
