import type { EditorLineDecoration } from '../EditorLineDecoration/EditorLineDecoration.ts'
import type { EditorLineDecorationTextDocument } from '../EditorLineDecorationTextDocument/EditorLineDecorationTextDocument.ts'

export interface RegisteredEditorLineDecorationProvider {
  readonly id: string
  readonly provideEditorLineDecoration: (
    textDocument: EditorLineDecorationTextDocument,
    rowIndex: number,
  ) => EditorLineDecoration | undefined | Promise<EditorLineDecoration | undefined>
}
