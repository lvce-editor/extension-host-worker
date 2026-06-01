import type { StatusBarItemProviderRegistrySnapshot } from './StatusBarItemProviderRegistrySnapshot.ts'
import { getStatusBarItemProviders } from './StatusBarItemProviderState.ts'

export const getStatusBarItemProviderRegistrySnapshot = (): StatusBarItemProviderRegistrySnapshot => {
  return {
    providers: getStatusBarItemProviders(),
  }
}
