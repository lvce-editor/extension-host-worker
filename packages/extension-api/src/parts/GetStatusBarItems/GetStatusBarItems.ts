import type { RegisteredStatusBarItemProvider } from '../RegisteredStatusBarItemProvider/RegisteredStatusBarItemProvider.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import { getStatusBarItemProviders } from '../StatusBarItemProviderState/StatusBarItemProviderState.ts'

const getStatusBarItem = (provider: RegisteredStatusBarItemProvider): StatusBarItem | undefined => {
  return provider.getStatusBarItem()
}

export const getStatusBarItems = (): readonly StatusBarItem[] => {
  return getStatusBarItemProviders().map(getStatusBarItem).filter((item): item is StatusBarItem => Boolean(item))
}
