import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { hasStatusBarItemProvider } from './StatusBarItemProviderState.ts'
import type { StatusBarItemProvider } from './StatusBarItemProvider.ts'

export const assertStatusBarItemProvider = (provider: StatusBarItemProvider): void => {
  if (!provider) {
    throw new ExtensionApiError('status bar item provider is not defined')
  }
  if (typeof provider.id !== 'string' || provider.id.length === 0) {
    throw new ExtensionApiError('status bar item provider is missing id')
  }
  if (typeof provider.getStatusBarItem !== 'function') {
    throw new ExtensionApiError(`status bar item provider ${provider.id} is missing getStatusBarItem function`)
  }
  if (hasStatusBarItemProvider(provider.id)) {
    throw new ExtensionApiError(`status bar item provider ${provider.id} is already registered`)
  }
}
