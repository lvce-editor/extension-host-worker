import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as GetLineMatchRegex from '../GetLineMatchRegex/GetLineMatchRegex.ts'
import * as GetLineMatchText from '../GetLineMatchText/GetLineMatchText.ts'

export const getLineMatch = (
  line: string,
  lineNumber: number,
  query: string,
  queryLower: string,
  useRegularExpression: number,
  matchCase: number,
  matchWholeWord: number,
): readonly SearchResult[] => {
  if (useRegularExpression) {
    return GetLineMatchRegex.getLineMatchRegex(line, lineNumber, query, matchCase)
  }
  return GetLineMatchText.getLineMatchText(line, lineNumber, query, queryLower, matchCase, matchWholeWord)
}
