import type { RegisteredStatusBarItemProvider } from '../RegisteredStatusBarItemProvider/RegisteredStatusBarItemProvider.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarItemProvider } from '../StatusBarItemProvider/StatusBarItemProvider.ts'
import type { StatusBarItemProviderHandle } from '../StatusBarItemProviderHandle/StatusBarItemProviderHandle.ts'
import type { StatusBarItemProviderRegistrySnapshot } from '../StatusBarItemProviderRegistrySnapshot/StatusBarItemProviderRegistrySnapshot.ts'
import * as NotifyStatusBarChange from '../NotifyStatusBarChange/NotifyStatusBarChange.ts'
import { createProviderRegistry } from '../ProviderRegistry/ProviderRegistry.ts'

const registry = createProviderRegistry<StatusBarItemProvider, RegisteredStatusBarItemProvider>({
  mapProvider(provider) {
    return {
      getStatusBarItem(): StatusBarItem | undefined {
        return provider.getStatusBarItem()
      },
      id: provider.id,
    }
  },
  providerName: 'status bar item provider',
  requiredMethods: ['getStatusBarItem'],
})

const getStatusBarItem = (provider: RegisteredStatusBarItemProvider): StatusBarItem | undefined => {
  return provider.getStatusBarItem()
}

const isStatusBarItem = (item: StatusBarItem | undefined): item is StatusBarItem => {
  return item !== undefined
}

export const hasStatusBarItemProvider = registry.hasProvider

export const registerStatusBarItemProvider = (provider: StatusBarItemProvider): StatusBarItemProviderHandle => {
  const registeredProvider = registry.registerProvider(provider)
  void NotifyStatusBarChange.notifyStatusBarChange(registeredProvider.id)
  return {
    dispose(): void {
      registry.deleteProvider(registeredProvider.id)
      void NotifyStatusBarChange.notifyStatusBarChange(registeredProvider.id)
    },
    async refresh(): Promise<void> {
      await NotifyStatusBarChange.notifyStatusBarChange(registeredProvider.id)
    },
  }
}

export const getStatusBarItemProviders = registry.getProviders

export const getStatusBarItems = (): readonly StatusBarItem[] => {
  return registry.getProviders().map(getStatusBarItem).filter(isStatusBarItem)
}

export const getStatusBarItemProviderRegistrySnapshot = (): StatusBarItemProviderRegistrySnapshot => {
  return {
    providers: registry.getProviders(),
  }
}

export const resetStatusBarItemProviderRegistry = registry.reset
