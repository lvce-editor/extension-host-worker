import type { Disposable } from '../Disposable/Disposable.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

export interface StatusBarItem {
  readonly icon?: string
  readonly name?: string
  readonly onClick?: string
  readonly text?: string
  readonly title?: string
}

export interface StatusBarItemProvider {
  readonly getStatusBarItem: () => StatusBarItem | undefined
  readonly id: string
}

export interface StatusBarItemProviderHandle extends Disposable {
  readonly refresh: () => Promise<void>
}

export interface StatusBarItemProviderRegistrySnapshot {
  readonly providers: readonly RegisteredStatusBarItemProvider[]
}

interface RegisteredStatusBarItemProvider {
  readonly getStatusBarItem: () => StatusBarItem | undefined
  readonly id: string
}

const providers = new Map<string, RegisteredStatusBarItemProvider>()

const assertStatusBarItemProvider = (provider: StatusBarItemProvider): void => {
  if (!provider) {
    throw new ExtensionApiError('status bar item provider is not defined')
  }
  if (typeof provider.id !== 'string' || provider.id.length === 0) {
    throw new ExtensionApiError('status bar item provider is missing id')
  }
  if (typeof provider.getStatusBarItem !== 'function') {
    throw new ExtensionApiError(`status bar item provider ${provider.id} is missing getStatusBarItem function`)
  }
  if (providers.has(provider.id)) {
    throw new ExtensionApiError(`status bar item provider ${provider.id} is already registered`)
  }
}

export const registerStatusBarItemProvider = (provider: StatusBarItemProvider): StatusBarItemProviderHandle => {
  assertStatusBarItemProvider(provider)
  providers.set(provider.id, {
    getStatusBarItem(): StatusBarItem | undefined {
      return provider.getStatusBarItem()
    },
    id: provider.id,
  })
  return {
    dispose(): void {
      providers.delete(provider.id)
    },
    async refresh(): Promise<void> {},
  }
}

export const getStatusBarItemProviderRegistrySnapshot = (): StatusBarItemProviderRegistrySnapshot => {
  return {
    providers: [...providers.values()],
  }
}

export const resetStatusBarItemProviderRegistry = (): void => {
  providers.clear()
}
