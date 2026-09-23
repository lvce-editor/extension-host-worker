import type { RegisteredStatusBarItemProvider } from '../RegisteredStatusBarItemProvider/RegisteredStatusBarItemProvider.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarItemContextMenuItem, StatusBarItemProvider } from '../StatusBarItemProvider/StatusBarItemProvider.ts'
import type { StatusBarItemProviderHandle } from '../StatusBarItemProviderHandle/StatusBarItemProviderHandle.ts'
import type { StatusBarItemProviderRegistrySnapshot } from '../StatusBarItemProviderRegistrySnapshot/StatusBarItemProviderRegistrySnapshot.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import * as NotifyStatusBarChange from '../NotifyStatusBarChange/NotifyStatusBarChange.ts'
import { createProviderRegistry } from '../ProviderRegistry/ProviderRegistry.ts'

const registry = createProviderRegistry<StatusBarItemProvider, RegisteredStatusBarItemProvider>({
  mapProvider(provider) {
    return {
      ...(provider.getContextMenuItems && { getContextMenuItems: provider.getContextMenuItems }),
      getStatusBarItem(): StatusBarItem | undefined {
        return provider.getStatusBarItem()
      },
      id: provider.id,
    }
  },
  providerName: 'status bar item provider',
  requiredMethods: ['getStatusBarItem'],
})

type StatusBarItemWithProviderId = StatusBarItem & { readonly providerId: string }

const getStatusBarItem = (provider: RegisteredStatusBarItemProvider): StatusBarItemWithProviderId | undefined => {
  const item = provider.getStatusBarItem()
  return item ? { ...item, providerId: provider.id } : undefined
}

export const getStatusBarItemContextMenuItems = (providerId: string): readonly StatusBarItemContextMenuItem[] => {
  const provider = registry.getProviders().find((candidate) => candidate.id === providerId)
  const items = provider?.getContextMenuItems?.()
  return Array.isArray(items) ? items : []
}

const isStatusBarItem = (item: StatusBarItemWithProviderId | undefined): item is StatusBarItemWithProviderId => {
  return item !== undefined
}

export const hasStatusBarItemProvider = registry.hasProvider

export const registerStatusBarItemProvider = (provider: StatusBarItemProvider): StatusBarItemProviderHandle => {
  const registeredProvider = registry.registerProvider(provider)
  ExtensionApiCommandRegistry.registerCommandMap(commandMap)
  void NotifyStatusBarChange.notifyStatusBarChange(registeredProvider.id)
  return {
    async dispose(): Promise<void> {
      registry.deleteProvider(registeredProvider.id)
      await NotifyStatusBarChange.notifyStatusBarChange(registeredProvider.id)
    },
    async refresh(): Promise<void> {
      await NotifyStatusBarChange.notifyStatusBarChange(registeredProvider.id)
    },
  }
}

export const getStatusBarItemProviders = registry.getProviders

export const getStatusBarItems = (): readonly StatusBarItemWithProviderId[] => {
  return registry.getProviders().map(getStatusBarItem).filter(isStatusBarItem)
}

export const getStatusBarItemProviderRegistrySnapshot = (): StatusBarItemProviderRegistrySnapshot => {
  return {
    providers: registry.getProviders().map((provider) => ({
      id: provider.id,
    })),
  }
}

const commandMap = {
  'ExtensionApi.getStatusBarItemContextMenuItems': getStatusBarItemContextMenuItems,
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
}

export const resetStatusBarItemProviderRegistry = registry.reset
