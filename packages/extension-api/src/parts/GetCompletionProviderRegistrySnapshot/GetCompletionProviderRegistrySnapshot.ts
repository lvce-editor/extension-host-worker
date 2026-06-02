import type { CompletionProviderRegistrySnapshot } from '../CompletionProviderRegistrySnapshot/CompletionProviderRegistrySnapshot.ts'
import { getCompletionProviders } from '../CompletionProviderState/CompletionProviderState.ts'

export const getCompletionProviderRegistrySnapshot = (): CompletionProviderRegistrySnapshot => {
  return {
    providers: getCompletionProviders(),
  }
}
