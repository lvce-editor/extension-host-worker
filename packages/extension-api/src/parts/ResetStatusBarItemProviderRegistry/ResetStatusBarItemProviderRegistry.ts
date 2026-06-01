import { clearStatusBarItemProviders } from '../StatusBarItemProviderState/StatusBarItemProviderState.ts'

export const resetStatusBarItemProviderRegistry = (): void => {
  clearStatusBarItemProviders()
}
