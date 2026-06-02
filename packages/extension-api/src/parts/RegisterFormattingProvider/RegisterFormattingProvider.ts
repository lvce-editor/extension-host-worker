import type { Disposable } from '../Disposable/Disposable.ts'
import type { FormattingProvider } from '../FormattingProvider/FormattingProvider.ts'
import { assertFormattingProvider } from '../AssertFormattingProvider/AssertFormattingProvider.ts'
import { deleteFormattingProvider, setFormattingProvider } from '../FormattingProviderState/FormattingProviderState.ts'

export const registerFormattingProvider = (provider: FormattingProvider): Disposable => {
  assertFormattingProvider(provider)
  setFormattingProvider(provider.id, {
    format(textDocument, ...args) {
      return provider.format(textDocument, ...args)
    },
    id: provider.id,
    languageId: provider.languageId,
  })
  return {
    dispose(): void {
      deleteFormattingProvider(provider.id)
    },
  }
}
