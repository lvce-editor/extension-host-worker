import { getStatusBarItemProviders } from './StatusBarItemProviderState.ts'
import type { StatusBarItemProviderRegistrySnapshot } from './StatusBarItemProviderRegistrySnapshot.ts'

export const getStatusBarItemProviderRegistrySnapshot = (): StatusBarItemProviderRegistrySnapshot => {
  return {
    providers: getStatusBarItemProviders(),
  }
}
