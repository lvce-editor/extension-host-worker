import type { RegisteredHoverProvider } from '../RegisteredHoverProvider/RegisteredHoverProvider.ts'

export interface HoverProviderRegistrySnapshot {
  readonly providers: readonly RegisteredHoverProvider[]
}
