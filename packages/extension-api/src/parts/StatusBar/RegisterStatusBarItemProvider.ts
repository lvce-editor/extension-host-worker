import type { StatusBarItem } from './StatusBarItem.ts'
import type { StatusBarItemProvider } from './StatusBarItemProvider.ts'
import type { StatusBarItemProviderHandle } from './StatusBarItemProviderHandle.ts'
import { assertStatusBarItemProvider } from './AssertStatusBarItemProvider.ts'
import { deleteStatusBarItemProvider, setStatusBarItemProvider } from './StatusBarItemProviderState.ts'

export const registerStatusBarItemProvider = (provider: StatusBarItemProvider): StatusBarItemProviderHandle => {
  assertStatusBarItemProvider(provider)
  setStatusBarItemProvider(provider.id, {
    getStatusBarItem(): StatusBarItem | undefined {
      return provider.getStatusBarItem()
    },
    id: provider.id,
  })
  return {
    dispose(): void {
      deleteStatusBarItemProvider(provider.id)
    },
    async refresh(): Promise<void> {},
  }
}
