import type { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import type { TextDocument } from '../CompletionTextDocument/CompletionTextDocument.ts'

export interface RegisteredCompletionProvider {
  readonly id: string
  readonly languageId: string
  readonly provideCompletions: (
    textDocument: TextDocument,
    offset: number,
    ...args: readonly unknown[]
  ) => readonly CompletionItem[] | Promise<readonly CompletionItem[]>
  readonly resolveCompletionItem?: (
    textDocument: TextDocument,
    offset: number,
    name: string,
    completionItem: CompletionItem,
    ...args: readonly unknown[]
  ) => CompletionItem | undefined | Promise<CompletionItem | undefined>
}
