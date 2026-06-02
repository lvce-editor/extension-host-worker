export interface TextDocument {
  readonly documentId: number
  readonly languageId: string
  readonly text: string
  readonly uri: string
}
