import { MatchCase } from '../SearchFlags/SearchFlags.ts'
import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

export const textSearchInText = (file: string, content: string, query: string, flags: number = 0): readonly SearchResult[] => {
  const matchCase = flags & MatchCase
  const results: SearchResult[] = []
  const lines = SplitLines.splitLines(content)
  const actualQuery = matchCase ? query : query.toLowerCase()
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineToQuery = matchCase ? line : line.toLowerCase()
    const index = lineToQuery.indexOf(actualQuery)
    if (index !== -1) {
      results.push({
        type: TextSearchResultType.Match,
        text: line,
        start: index,
        end: index + query.length,
        lineNumber: i,
      })
    }
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
