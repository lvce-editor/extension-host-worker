import type { Disposable } from '../Disposable/Disposable.ts'
import type { CompletionProvider } from '../CompletionProvider/CompletionProvider.ts'
import { assertCompletionProvider } from '../AssertCompletionProvider/AssertCompletionProvider.ts'
import { deleteCompletionProvider, setCompletionProvider } from '../CompletionProviderState/CompletionProviderState.ts'

export const registerCompletionProvider = (provider: CompletionProvider): Disposable => {
  assertCompletionProvider(provider)
  setCompletionProvider(provider.id, {
    id: provider.id,
    languageId: provider.languageId,
    provideCompletions(textDocument, offset, ...args) {
      return provider.provideCompletions(textDocument, offset, ...args)
    },
    resolveCompletionItem: provider.resolveCompletionItem
      ? (textDocument, offset, name, completionItem, ...args) => provider.resolveCompletionItem?.(textDocument, offset, name, completionItem, ...args)
      : undefined,
  })
  return {
    dispose(): void {
      deleteCompletionProvider(provider.id)
    },
  }
}
