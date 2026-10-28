export interface HoverResult {
  readonly displayString?: string
  readonly displayStringLanguageId?: string
  readonly documentation?: string
  readonly documentationFormat?: 'markdown' | 'plaintext'
  readonly text?: string
}
