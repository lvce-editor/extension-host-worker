import type { CompletionProvider } from '../CompletionProvider/CompletionProvider.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { hasCompletionProvider } from '../CompletionProviderState/CompletionProviderState.ts'

export const assertCompletionProvider = (provider: CompletionProvider): void => {
  if (!provider) {
    throw new ExtensionApiError('completion provider is not defined')
  }
  if (!provider.id) {
    throw new ExtensionApiError('completion provider is missing id')
  }
  if (!provider.languageId) {
    throw new ExtensionApiError(`completion provider ${provider.id} is missing languageId`)
  }
  if (typeof provider.provideCompletions !== 'function') {
    throw new ExtensionApiError(`completion provider ${provider.id} is missing provideCompletions function`)
  }
  if (provider.resolveCompletionItem !== undefined && typeof provider.resolveCompletionItem !== 'function') {
    throw new ExtensionApiError(`completion provider ${provider.id} has invalid resolveCompletionItem function`)
  }
  if (hasCompletionProvider(provider.id)) {
    throw new ExtensionApiError(`completion provider ${provider.id} is already registered`)
  }
}
