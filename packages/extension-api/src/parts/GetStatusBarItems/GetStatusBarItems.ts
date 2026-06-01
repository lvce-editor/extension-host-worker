import type { RegisteredStatusBarItemProvider } from '../RegisteredStatusBarItemProvider/RegisteredStatusBarItemProvider.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import { getStatusBarItemProviders } from '../StatusBarItemProviderState/StatusBarItemProviderState.ts'

const getStatusBarItem = (provider: RegisteredStatusBarItemProvider): StatusBarItem | undefined => {
  return provider.getStatusBarItem()
}

const isStatusBarItem = (item: StatusBarItem | undefined): item is StatusBarItem => {
  return item !== undefined
}

export const getStatusBarItems = (): readonly StatusBarItem[] => {
  return getStatusBarItemProviders().map(getStatusBarItem).filter(isStatusBarItem)
}
