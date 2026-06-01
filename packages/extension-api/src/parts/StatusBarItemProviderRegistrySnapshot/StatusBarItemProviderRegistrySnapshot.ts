import type { RegisteredStatusBarItemProvider } from '../RegisteredStatusBarItemProvider/RegisteredStatusBarItemProvider.ts'

export interface StatusBarItemProviderRegistrySnapshot {
  readonly providers: readonly RegisteredStatusBarItemProvider[]
}
