import { clearCompletionProviders } from '../CompletionProviderState/CompletionProviderState.ts'

export const resetCompletionProviderRegistry = (): void => {
  clearCompletionProviders()
}
