import type { RegisteredStatusBarItemProvider } from './RegisteredStatusBarItemProvider.ts'

export interface StatusBarItemProviderRegistrySnapshot {
  readonly providers: readonly RegisteredStatusBarItemProvider[]
}
