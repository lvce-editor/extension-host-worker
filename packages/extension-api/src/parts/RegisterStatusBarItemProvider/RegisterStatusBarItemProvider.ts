import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarItemProvider } from '../StatusBarItemProvider/StatusBarItemProvider.ts'
import type { StatusBarItemProviderHandle } from '../StatusBarItemProviderHandle/StatusBarItemProviderHandle.ts'
import { assertStatusBarItemProvider } from '../AssertStatusBarItemProvider/AssertStatusBarItemProvider.ts'
import * as NotifyStatusBarChange from '../NotifyStatusBarChange/NotifyStatusBarChange.ts'
import { deleteStatusBarItemProvider, setStatusBarItemProvider } from '../StatusBarItemProviderState/StatusBarItemProviderState.ts'

export const registerStatusBarItemProvider = (provider: StatusBarItemProvider): StatusBarItemProviderHandle => {
  assertStatusBarItemProvider(provider)
  setStatusBarItemProvider(provider.id, {
    getStatusBarItem(): StatusBarItem | undefined {
      return provider.getStatusBarItem()
    },
    id: provider.id,
  })
  void NotifyStatusBarChange.notifyStatusBarChange(provider.id)
  return {
    dispose(): void {
      deleteStatusBarItemProvider(provider.id)
      void NotifyStatusBarChange.notifyStatusBarChange(provider.id)
    },
    async refresh(): Promise<void> {
      await NotifyStatusBarChange.notifyStatusBarChange(provider.id)
    },
  }
}
