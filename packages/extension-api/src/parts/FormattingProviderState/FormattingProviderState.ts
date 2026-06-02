import type { RegisteredFormattingProvider } from '../RegisteredFormattingProvider/RegisteredFormattingProvider.ts'

const providers: Record<string, RegisteredFormattingProvider> = Object.create(null)

export const hasFormattingProvider = (id: string): boolean => {
  return id in providers
}

export const setFormattingProvider = (id: string, provider: RegisteredFormattingProvider): void => {
  providers[id] = provider
}

export const deleteFormattingProvider = (id: string): void => {
  delete providers[id]
}

export const getFormattingProviders = (): RegisteredFormattingProvider[] => {
  return Object.values(providers)
}

export const getFormattingProviderByLanguageId = (languageId: string): RegisteredFormattingProvider | undefined => {
  return Object.values(providers).find((provider) => provider.languageId === languageId)
}

export const clearFormattingProviders = (): void => {
  for (const id of Object.keys(providers)) {
    delete providers[id]
  }
}
