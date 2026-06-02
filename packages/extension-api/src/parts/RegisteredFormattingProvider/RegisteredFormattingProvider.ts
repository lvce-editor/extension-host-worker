import type { FormattingEdit } from '../FormattingEdit/FormattingEdit.ts'
import type { TextDocument } from '../FormattingTextDocument/FormattingTextDocument.ts'

export interface RegisteredFormattingProvider {
  readonly format: (textDocument: TextDocument, ...args: readonly unknown[]) => readonly FormattingEdit[] | Promise<readonly FormattingEdit[]>
  readonly id: string
  readonly languageId: string
}
