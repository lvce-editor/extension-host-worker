import type { StatusBarItemProviderRegistrySnapshot } from '../StatusBarItemProviderRegistrySnapshot/StatusBarItemProviderRegistrySnapshot.ts'
import { getStatusBarItemProviders } from '../StatusBarItemProviderState/StatusBarItemProviderState.ts'

export const getStatusBarItemProviderRegistrySnapshot = (): StatusBarItemProviderRegistrySnapshot => {
  return {
    providers: getStatusBarItemProviders(),
  }
}
