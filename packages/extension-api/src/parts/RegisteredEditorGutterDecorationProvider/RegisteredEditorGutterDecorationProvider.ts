import type { EditorGutterDecoration } from '../EditorGutterDecoration/EditorGutterDecoration.ts'
import type { EditorGutterDecorationTextDocument } from '../EditorGutterDecorationTextDocument/EditorGutterDecorationTextDocument.ts'

export interface RegisteredEditorGutterDecorationProvider {
  readonly id: string
  readonly provideEditorGutterDecorations: (
    textDocument: EditorGutterDecorationTextDocument,
  ) => readonly EditorGutterDecoration[] | Promise<readonly EditorGutterDecoration[]>
}
