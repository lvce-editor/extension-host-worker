import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

export const textSearchInText = (file: string, content: string, query: string): readonly SearchResult[] => {
  const results: SearchResult[] = []
  const lines = SplitLines.splitLines(content)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const index = line.indexOf(query)
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
