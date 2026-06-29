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
  'getFeatures',
  'getFileBefore',
  'getFileDecorations',
  'getGroups',
  'isActive',
]

type MutableRegisteredSourceControlProvider = {
  -readonly [K in keyof RegisteredSourceControlProvider]: RegisteredSourceControlProvider[K]
}

const assertOptionalProviderMethod = (provider: Record<string, unknown>, providerId: string, methodName: string): void => {
  if (provider[methodName] !== undefined && typeof provider[methodName] !== 'function') {
    throw new ExtensionApiError(`source control provider ${providerId} has invalid ${methodName} function`)
  }
}

const assertSourceControlProvider = (provider: SourceControlProvider): void => {
  if (!provider) {
    throw new ExtensionApiError('source control provider is not defined')
  }
  const providerRecord = provider as unknown as Record<string, unknown>
  const { id } = providerRecord
  if (typeof id !== 'string' || id.length === 0) {
    throw new ExtensionApiError('source control provider is missing id')
  }
  if (typeof providerRecord.getChangedFiles !== 'function') {
    throw new ExtensionApiError(`source control provider ${id} is missing getChangedFiles function`)
  }
  for (const methodName of optionalMethods) {
    assertOptionalProviderMethod(providerRecord, id, methodName)
  }
  if (id in providers) {
    throw new ExtensionApiError(`source control provider ${id} is already registered`)
  }
}

const getProvider = (id: string): RegisteredSourceControlProvider => {
  const provider = providers[id]
  if (!provider) {
    throw new ExtensionApiError(`source control provider ${id} not found`)
  }
  return provider
}

const mapSourceControlProvider = (provider: SourceControlProvider): RegisteredSourceControlProvider => {
  const registeredProvider: MutableRegisteredSourceControlProvider = {
    getChangedFiles: () => provider.getChangedFiles(),
    id: provider.id,
  }
  if (provider.acceptInput) {
    registeredProvider.acceptInput = (value) => provider.acceptInput!(value)
  }
  if (provider.add) {
    registeredProvider.add = (path) => provider.add!(path)
  }
  if (provider.discard) {
    registeredProvider.discard = (path) => provider.discard!(path)
  }
  if (provider.generateCommitMessage) {
    registeredProvider.generateCommitMessage = () => provider.generateCommitMessage!()
  }
  if (provider.getFeatures) {
    registeredProvider.getFeatures = () => provider.getFeatures!()
  }
  if (provider.getFileBefore) {
    registeredProvider.getFileBefore = (uri) => provider.getFileBefore!(uri)
  }
  if (provider.getFileDecorations) {
    registeredProvider.getFileDecorations = (uris) => provider.getFileDecorations!(uris)
  }
  if (provider.getGroups) {
    registeredProvider.getGroups = (cwd) => provider.getGroups!(cwd)
  }
  if (provider.isActive) {
    registeredProvider.isActive = (scheme, root) => provider.isActive!(scheme, root)
  }
  return registeredProvider
}

export const registerSourceControlProvider = (provider: SourceControlProvider): Disposable => {
  assertSourceControlProvider(provider)
  providers[provider.id] = mapSourceControlProvider(provider)
  return {
    dispose(): void {
      delete providers[provider.id]
    },
  }
}

export const executeSourceControlAcceptInput = async (id: string, value: string): Promise<unknown> => {
  return getProvider(id).acceptInput?.(value)
}

export const executeSourceControlAdd = async (id: string, path: string): Promise<unknown> => {
  return getProvider(id).add?.(path)
}

export const executeSourceControlDiscard = async (id: string, path: string): Promise<unknown> => {
  return getProvider(id).discard?.(path)
}

export const executeSourceControlGenerateCommitMessage = async (id: string): Promise<unknown> => {
  return getProvider(id).generateCommitMessage?.()
}

export const executeSourceControlGetChangedFiles = async (id: string): Promise<readonly unknown[]> => {
  return getProvider(id).getChangedFiles()
}

export const executeSourceControlGetFeatures = async (id: string): Promise<unknown> => {
  return getProvider(id).getFeatures?.() ?? {}
}

export const executeSourceControlGetFileBefore = async (id: string, uri: string): Promise<unknown> => {
  return getProvider(id).getFileBefore?.(uri)
}

export const executeSourceControlGetFileDecorations = async (id: string, uris: readonly string[]): Promise<unknown> => {
  return getProvider(id).getFileDecorations?.(uris) ?? []
}

export const executeSourceControlGetGroups = async (id: string, cwd: string): Promise<unknown> => {
  const provider = getProvider(id)
  if (provider.getGroups) {
    return provider.getGroups(cwd)
  }
  return [
    {
      id: 'changes',
      items: await provider.getChangedFiles(),
      label: 'Changes',
    },
  ]
}

export const executeSourceControlIsActive = async (id: string, scheme: string, root: string): Promise<boolean> => {
  return Boolean(await getProvider(id).isActive?.(scheme, root))
}

export const getSourceControlProviderRegistrySnapshot = (): SourceControlProviderRegistrySnapshot => {
  return {
    providers: Object.values(providers).map((provider) => ({
      id: provider.id,
    })),
  }
}

export const resetSourceControlProviderRegistry = (): void => {
  for (const id of Object.keys(providers)) {
    delete providers[id]
  }
}
