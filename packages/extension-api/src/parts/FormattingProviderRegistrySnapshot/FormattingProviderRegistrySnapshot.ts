import type { RegisteredFormattingProvider } from '../RegisteredFormattingProvider/RegisteredFormattingProvider.ts'

export interface FormattingProviderRegistrySnapshot {
  readonly providers: readonly RegisteredFormattingProvider[]
}
