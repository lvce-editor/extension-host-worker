import type { RegisteredStatusBarItemProvider } from './RegisteredStatusBarItemProvider.ts'

const providers: Record<string, RegisteredStatusBarItemProvider> = Object.create(null)

export const hasStatusBarItemProvider = (id: string): boolean => {
  return id in providers
}

export const setStatusBarItemProvider = (id: string, provider: RegisteredStatusBarItemProvider): void => {
  providers[id] = provider
}

export const deleteStatusBarItemProvider = (id: string): void => {
  delete providers[id]
}

export const getStatusBarItemProviders = (): RegisteredStatusBarItemProvider[] => {
  return Object.values(providers)
}

export const clearStatusBarItemProviders = (): void => {
  for (const id of Object.keys(providers)) {
    delete providers[id]
  }
}
