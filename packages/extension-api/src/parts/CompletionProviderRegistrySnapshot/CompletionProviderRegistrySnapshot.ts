import type { RegisteredCompletionProvider } from '../RegisteredCompletionProvider/RegisteredCompletionProvider.ts'

export interface CompletionProviderRegistrySnapshot {
  readonly providers: readonly RegisteredCompletionProvider[]
}
