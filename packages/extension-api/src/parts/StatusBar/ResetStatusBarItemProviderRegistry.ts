import { clearStatusBarItemProviders } from './StatusBarItemProviderState.ts'

export const resetStatusBarItemProviderRegistry = (): void => {
  clearStatusBarItemProviders()
}
