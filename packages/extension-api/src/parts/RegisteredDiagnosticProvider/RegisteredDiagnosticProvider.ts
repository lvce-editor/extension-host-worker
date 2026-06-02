import type { Diagnostic } from '../DiagnosticResult/DiagnosticResult.ts'
import type { TextDocument } from '../DiagnosticTextDocument/DiagnosticTextDocument.ts'

export interface RegisteredDiagnosticProvider {
  readonly id: string
  readonly languageId: string
  readonly provideDiagnostics: (textDocument: TextDocument, ...args: readonly unknown[]) => readonly Diagnostic[] | Promise<readonly Diagnostic[]>
}
