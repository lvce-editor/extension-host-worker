import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

type ProviderMethod = (...args: readonly unknown[]) => unknown

interface ProviderWithId {
  readonly id: string
}

interface ProviderWithLanguageId extends ProviderWithId {
  readonly languageId: string
}

interface ProviderRegistryOptions<TProvider, TRegisteredProvider extends ProviderWithId> {
  readonly providerName: string
  readonly requireLanguageId?: boolean
  readonly requiredMethods: readonly string[]
  readonly optionalMethods?: readonly string[]
  readonly mapProvider: (provider: TProvider) => TRegisteredProvider
}

export interface ProviderRegistry<TProvider, TRegisteredProvider extends ProviderWithId> {
  readonly deleteProvider: (id: string) => void
  readonly executeProviderByLanguageId: <TResult>(
    languageId: string,
    methodName: keyof TRegisteredProvider & string,
    args: readonly unknown[],
    validateResult?: (result: unknown) => TResult,
  ) => Promise<TResult>
  readonly getProviderByLanguageId: (languageId: string) => TRegisteredProvider | undefined
  readonly getProviders: () => TRegisteredProvider[]
  readonly hasProvider: (id: string) => boolean
  readonly registerProvider: (provider: TProvider) => TRegisteredProvider
  readonly reset: () => void
}

const getProviderMethod = <TRegisteredProvider extends ProviderWithId>(
  provider: TRegisteredProvider,
  methodName: keyof TRegisteredProvider & string,
): ProviderMethod | undefined => {
  const method = provider[methodName]
  if (typeof method !== 'function') {
    return undefined
  }
  return method as ProviderMethod
}

const assertProviderMethod = (provider: Record<string, unknown>, providerName: string, providerId: string, methodName: string): void => {
  if (typeof provider[methodName] !== 'function') {
    throw new ExtensionApiError(`${providerName} ${providerId} is missing ${methodName} function`)
  }
}

const assertOptionalProviderMethod = (provider: Record<string, unknown>, providerName: string, providerId: string, methodName: string): void => {
  if (provider[methodName] !== undefined && typeof provider[methodName] !== 'function') {
    throw new ExtensionApiError(`${providerName} ${providerId} has invalid ${methodName} function`)
  }
}

export const createProviderRegistry = <TProvider, TRegisteredProvider extends ProviderWithId>({
  mapProvider,
  optionalMethods = [],
  providerName,
  requiredMethods,
  requireLanguageId = false,
}: ProviderRegistryOptions<TProvider, TRegisteredProvider>): ProviderRegistry<TProvider, TRegisteredProvider> => {
  const providers: Record<string, TRegisteredProvider> = Object.create(null)

  const hasProvider = (id: string): boolean => {
    return id in providers
  }

  const registerProvider = (provider: TProvider): TRegisteredProvider => {
    if (!provider) {
      throw new ExtensionApiError(`${providerName} is not defined`)
    }
    const providerRecord = provider as Record<string, unknown>
    const id = providerRecord.id
    if (typeof id !== 'string' || id.length === 0) {
      throw new ExtensionApiError(`${providerName} is missing id`)
    }
    if (requireLanguageId && (typeof providerRecord.languageId !== 'string' || providerRecord.languageId.length === 0)) {
      throw new ExtensionApiError(`${providerName} ${id} is missing languageId`)
    }
    for (const methodName of requiredMethods) {
      assertProviderMethod(providerRecord, providerName, id, methodName)
    }
    for (const methodName of optionalMethods) {
      assertOptionalProviderMethod(providerRecord, providerName, id, methodName)
    }
    if (hasProvider(id)) {
      throw new ExtensionApiError(`${providerName} ${id} is already registered`)
    }
    const registeredProvider = mapProvider(provider)
    providers[registeredProvider.id] = registeredProvider
    return registeredProvider
  }

  const deleteProvider = (id: string): void => {
    delete providers[id]
  }

  const getProviders = (): TRegisteredProvider[] => {
    return Object.values(providers)
  }

  const getProviderByLanguageId = (languageId: string): TRegisteredProvider | undefined => {
    return getProviders().find((provider): provider is TRegisteredProvider & ProviderWithLanguageId => {
      return 'languageId' in provider && provider.languageId === languageId
    })
  }

  const reset = (): void => {
    for (const id of Object.keys(providers)) {
      delete providers[id]
    }
  }

  const executeProviderByLanguageId = async <TResult>(
    languageId: string,
    methodName: keyof TRegisteredProvider & string,
    args: readonly unknown[],
    validateResult?: (result: unknown) => TResult,
  ): Promise<TResult> => {
    const provider = getProviderByLanguageId(languageId)
    if (!provider) {
      throw new ExtensionApiError(`No ${providerName} found for ${languageId}`)
    }
    const method = getProviderMethod(provider, methodName)
    if (!method) {
      throw new ExtensionApiError(`${providerName} ${provider.id} is missing ${methodName} function`)
    }
    const result = await method(...args)
    return validateResult ? validateResult(result) : (result as TResult)
  }

  return {
    deleteProvider,
    executeProviderByLanguageId,
    getProviderByLanguageId,
    getProviders,
    hasProvider,
    registerProvider,
    reset,
  }
}
