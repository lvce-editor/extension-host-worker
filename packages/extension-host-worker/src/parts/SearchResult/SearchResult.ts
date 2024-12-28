export interface SearchResult {
  readonly type: number
  readonly start: number
  readonly end: number
  readonly lineNumber: number
  readonly text: string
}
