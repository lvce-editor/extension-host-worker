import type { SignatureHelpResult } from '../SignatureHelpResult/SignatureHelpResult.ts'
import type { TextDocument } from '../SignatureHelpTextDocument/SignatureHelpTextDocument.ts'

export interface SignatureHelpProvider {
  readonly id: string
  readonly languageId: string
  readonly provideSignatureHelp: (
    textDocument: TextDocument,
    offset: number,
    ...args: readonly unknown[]
  ) => SignatureHelpResult | undefined | Promise<SignatureHelpResult | undefined>
}
