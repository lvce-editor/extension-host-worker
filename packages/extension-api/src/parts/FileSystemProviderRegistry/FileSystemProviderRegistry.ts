import type { Disposable } from '../Disposable/Disposable.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import type { FileSystemProvider } from '../FileSystemProvider/FileSystemProvider.ts'
import type { FileSystemProviderRegistrySnapshot } from '../FileSystemProviderRegistrySnapshot/FileSystemProviderRegistrySnapshot.ts'
import type { RegisteredFileSystemProvider } from '../RegisteredFileSystemProvider/RegisteredFileSystemProvider.ts'

const providers: Record<string, RegisteredFileSystemProvider> = Object.create(null)

const assertFileSystemProvider = (provider: FileSystemProvider): void => {
  if (!provider) {
    throw new ExtensionApiError('file system provider is not defined')
  }
  if (typeof provider.id !== 'string' || provider.id.length === 0) {
    throw new ExtensionApiError('file system provider is missing id')
  }
  if (typeof provider.readFile !== 'function') {
    throw new ExtensionApiError(`file system provider ${provider.id} is missing readFile function`)
  }
  if (provider.id in providers) {
    throw new ExtensionApiError(`file system provider ${provider.id} is already registered`)
  }
}

const getProvider = (id: string): RegisteredFileSystemProvider => {
  const provider = providers[id]
  if (!provider) {
    throw new ExtensionApiError(`file system provider ${id} not found`)
  }
  return provider
}

export const executeFileSystemProviderReadFile = async (id: string, uri: string): Promise<string> => {
  return getProvider(id).readFile(uri)
}

export const getFileSystemProviderRegistrySnapshot = (): FileSystemProviderRegistrySnapshot => {
  return {
    providers: Object.values(providers).map((provider) => ({
      id: provider.id,
    })),
  }
}

export const registerFileSystemProvider = (provider: FileSystemProvider): Disposable => {
  assertFileSystemProvider(provider)
  providers[provider.id] = {
    id: provider.id,
    readFile: (uri) => provider.readFile(uri),
  }
  return {
    dispose(): void {
      delete providers[provider.id]
    },
  }
}

export const resetFileSystemProviderRegistry = (): void => {
  for (const id of Object.keys(providers)) {
    delete providers[id]
  }
}
