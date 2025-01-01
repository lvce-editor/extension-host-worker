import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

export const getLineMatchRegex = (line: string, lineNumber: number, query: string, matchCase: number): readonly SearchResult[] => {
  try {
    const flags = matchCase ? '' : 'i'
    const regex = new RegExp(query, flags)
    const match = line.match(regex)
    if (match) {
      return [
        {
          type: TextSearchResultType.Match,
          text: line,
          start: match.index!,
          end: match.index! + match[0].length,
          lineNumber,
        },
      ]
    }
  } catch {
    // Invalid regex pattern - return empty array
  }
  return []
}
