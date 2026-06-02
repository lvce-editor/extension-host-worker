import type { FormattingEdit } from '../FormattingEdit/FormattingEdit.ts'

export interface TextDocument {
  readonly documentId: number
  readonly languageId: string
  readonly text: string
  readonly uri: string
}

export interface FormattingProvider {
  readonly format: (textDocument: TextDocument, ...args: readonly unknown[]) => readonly FormattingEdit[] | Promise<readonly FormattingEdit[]>
  readonly id: string
  readonly languageId: string
}
