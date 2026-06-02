import type { RegisteredCompletionProvider } from '../RegisteredCompletionProvider/RegisteredCompletionProvider.ts'

const providers: Record<string, RegisteredCompletionProvider> = Object.create(null)

export const hasCompletionProvider = (id: string): boolean => {
  return id in providers
}

export const setCompletionProvider = (id: string, provider: RegisteredCompletionProvider): void => {
  providers[id] = provider
}

export const deleteCompletionProvider = (id: string): void => {
  delete providers[id]
}

export const getCompletionProviders = (): RegisteredCompletionProvider[] => {
  return Object.values(providers)
}

export const getCompletionProviderByLanguageId = (languageId: string): RegisteredCompletionProvider | undefined => {
  return Object.values(providers).find((provider) => provider.languageId === languageId)
}

export const clearCompletionProviders = (): void => {
  for (const id in providers) {
    delete providers[id]
  }
}
