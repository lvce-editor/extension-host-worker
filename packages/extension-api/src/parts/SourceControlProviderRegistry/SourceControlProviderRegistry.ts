import type { Disposable } from '../Disposable/Disposable.ts'
import type { RegisteredSourceControlProvider } from '../RegisteredSourceControlProvider/RegisteredSourceControlProvider.ts'
import type { SourceControlProvider } from '../SourceControlProvider/SourceControlProvider.ts'
import type { SourceControlProviderRegistrySnapshot } from '../SourceControlProviderRegistrySnapshot/SourceControlProviderRegistrySnapshot.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

const providers: Record<string, RegisteredSourceControlProvider> = Object.create(null)

const optionalMethods = [
  'acceptInput',
  'add',
  'discard',
  'generateCommitMessage',
  'getChangedFiles',
  'getFeatures',
  'getFileBefore',
  'getFileDecorations',
  'getGroups',
  'isActive',
] as const

const assertOptionalProviderMethod = (provider: Record<string, unknown>, providerId: string, methodName: string): void => {
  if (provider[methodName] !== undefined && typeof provider[methodName] !== 'function') {
    throw new ExtensionApiError(`source control provider ${providerId} has invalid ${methodName} function`)
  }
}

const getProvider = (providerId: string): RegisteredSourceControlProvider => {
  const provider = providers[providerId]
  if (!provider) {
    throw new Error('no source control provider found')
  }
  return provider
}

export const hasSourceControlProvider = (id: string): boolean => {
  return id in providers
}

export const registerSourceControlProvider = (provider: SourceControlProvider): Disposable => {
  if (!provider) {
    throw new ExtensionApiError('source control provider is not defined')
  }
  const providerRecord = provider as unknown as Record<string, unknown>
  const { id } = providerRecord
  if (typeof id !== 'string' || id.length === 0) {
    throw new ExtensionApiError('source control provider is missing id')
  }
  for (const methodName of optionalMethods) {
    assertOptionalProviderMethod(providerRecord, id, methodName)
  }
  if (hasSourceControlProvider(id)) {
    throw new ExtensionApiError(`source control provider ${id} is already registered`)
  }
  const registeredProvider: RegisteredSourceControlProvider = {
    ...provider,
    id,
  }
  providers[id] = registeredProvider
  return {
    dispose(): void {
      delete providers[registeredProvider.id]
    },
  }
}

export const getChangedFiles = async (providerId: string): Promise<unknown> => {
  const provider = getProvider(providerId)
  return provider.getChangedFiles?.()
}

export const getFileBefore = async (providerId: string, uri: string): Promise<unknown> => {
  const provider = getProvider(providerId)
  return provider.getFileBefore?.(uri)
}

const getGroupsFromProvider = async (provider: RegisteredSourceControlProvider, cwd: string): Promise<unknown> => {
  if (provider.getGroups) {
    return provider.getGroups(cwd)
  }
  if (provider.getChangedFiles) {
    const files = await provider.getChangedFiles()
    return [
      {
        id: 'changes',
        items: files,
        label: 'Changes',
      },
    ]
  }
  throw new Error('source control provider is missing required function getGroups')
}

export const getGroups = async (providerId: string, cwd: string): Promise<unknown> => {
  const provider = getProvider(providerId)
  return getGroupsFromProvider(provider, cwd)
}

export const acceptInput = async (providerId: string, value: string): Promise<void> => {
  const provider = getProvider(providerId)
  await provider.acceptInput?.(value)
}

export const generateCommitMessage = async (providerId: string): Promise<unknown> => {
  const provider = getProvider(providerId)
  if (typeof provider.generateCommitMessage !== 'function') {
    throw new TypeError('source control provider is missing required function generateCommitMessage')
  }
  return provider.generateCommitMessage()
}

export const getFeatures = async (providerId: string): Promise<unknown> => {
  const provider = getProvider(providerId)
  if (typeof provider.getFeatures === 'function') {
    return provider.getFeatures()
  }
  if (provider.features && typeof provider.features === 'object') {
    return provider.features
  }
  if ('showGenerateCommitMessageButton' in provider) {
    return {
      showGenerateCommitMessageButton: provider.showGenerateCommitMessageButton,
    }
  }
  return {}
}

const getFirstProvider = (): RegisteredSourceControlProvider | undefined => {
  return Object.values(providers)[0]
}

export const add = async (path: string): Promise<void> => {
  const provider = getFirstProvider()
  await provider?.add?.(path)
}

export const discard = async (path: string): Promise<void> => {
  const provider = getFirstProvider()
  await provider?.discard?.(path)
}

export const getEnabledProviderIds = async (scheme: string, root: string): Promise<readonly string[]> => {
  const enabledIds: string[] = []
  for (const provider of Object.values(providers)) {
    if (typeof provider.isActive !== 'function') {
      continue
    }
    const isActive = await provider.isActive(scheme, root)
    if (isActive) {
      enabledIds.push(provider.id)
    }
  }
  return enabledIds
}

export const getFileDecorations = async (providerId: string, uris: readonly string[]): Promise<readonly unknown[]> => {
  const provider = providers[providerId]
  if (!provider || !provider.getFileDecorations) {
    return []
  }
  const decorations = await provider.getFileDecorations(uris)
  return Array.isArray(decorations) ? decorations : []
}

export const getSourceControlProviders = (): RegisteredSourceControlProvider[] => {
  return Object.values(providers)
}

export const getSourceControlProviderRegistrySnapshot = (): SourceControlProviderRegistrySnapshot => {
  return {
    providers: getSourceControlProviders().map((provider) => ({
      id: provider.id,
    })),
  }
}

export const resetSourceControlProviderRegistry = (): void => {
  for (const id of Object.keys(providers)) {
    delete providers[id]
  }
}
