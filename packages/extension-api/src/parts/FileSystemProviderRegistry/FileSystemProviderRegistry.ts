import type { Disposable } from '../Disposable/Disposable.ts'
import type { FileSystemDirent } from '../FileSystemDirent/FileSystemDirent.ts'
import type { FileSystemProvider } from '../FileSystemProvider/FileSystemProvider.ts'
import type { FileSystemProviderRegistrySnapshot } from '../FileSystemProviderRegistrySnapshot/FileSystemProviderRegistrySnapshot.ts'
import type { RegisteredFileSystemProvider } from '../RegisteredFileSystemProvider/RegisteredFileSystemProvider.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

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
  if (provider.readDirWithFileTypes !== undefined && typeof provider.readDirWithFileTypes !== 'function') {
    throw new ExtensionApiError(`file system provider ${provider.id} has invalid readDirWithFileTypes function`)
  }
  if (provider.isReadonly !== undefined && typeof provider.isReadonly !== 'function') {
    throw new ExtensionApiError(`file system provider ${provider.id} has invalid isReadonly function`)
  }
  for (const method of ['mkdir', 'remove', 'rename', 'writeFile'] as const) {
    if (provider[method] !== undefined && typeof provider[method] !== 'function') {
      throw new ExtensionApiError(`file system provider ${provider.id} has invalid ${method} function`)
    }
  }
  if (provider.pathSeparator !== undefined && typeof provider.pathSeparator !== 'string') {
    throw new ExtensionApiError(`file system provider ${provider.id} has invalid pathSeparator`)
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

export const executeFileSystemProviderMkdir = async (id: string, uri: string): Promise<void> => {
  const provider = getProvider(id)
  if (!provider.mkdir) {
    throw new ExtensionApiError(`file system provider ${id} is missing mkdir function`)
  }
  await provider.mkdir(uri)
}

export const executeFileSystemProviderRemove = async (id: string, uri: string): Promise<void> => {
  const provider = getProvider(id)
  if (!provider.remove) {
    throw new ExtensionApiError(`file system provider ${id} is missing remove function`)
  }
  await provider.remove(uri)
}

export const executeFileSystemProviderRename = async (id: string, oldUri: string, newUri: string): Promise<void> => {
  const provider = getProvider(id)
  if (!provider.rename) {
    throw new ExtensionApiError(`file system provider ${id} is missing rename function`)
  }
  await provider.rename(oldUri, newUri)
}

export const executeFileSystemProviderWriteFile = async (id: string, uri: string, content: string): Promise<void> => {
  const provider = getProvider(id)
  if (!provider.writeFile) {
    throw new ExtensionApiError(`file system provider ${id} is missing writeFile function`)
  }
  await provider.writeFile(uri, content)
}

export const executeFileSystemProviderReadDirWithFileTypes = async (id: string, uri: string): Promise<readonly FileSystemDirent[]> => {
  const provider = getProvider(id)
  if (!provider.readDirWithFileTypes) {
    throw new ExtensionApiError(`file system provider ${id} is missing readDirWithFileTypes function`)
  }
  return provider.readDirWithFileTypes(uri)
}

export const executeFileSystemProviderGetPathSeparator = (id: string): string => {
  return getProvider(id).pathSeparator || '/'
}

export const getFileSystemProviderPathSeparator = (id: string): string | undefined => {
  const provider = providers[id]
  if (!provider) {
    return undefined
  }
  return provider.pathSeparator || '/'
}

export const executeFileSystemProviderIsReadonly = async (id: string): Promise<boolean> => {
  const provider = getProvider(id)
  return provider.isReadonly ? provider.isReadonly() : false
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
    isReadonly: provider.isReadonly,
    mkdir: provider.mkdir,
    pathSeparator: provider.pathSeparator,
    readDirWithFileTypes: provider.readDirWithFileTypes,
    readFile: (uri) => provider.readFile(uri),
    remove: provider.remove,
    rename: provider.rename,
    writeFile: provider.writeFile,
  }
  ExtensionApiCommandRegistry.registerCommandMap(commandMap)
  return {
    dispose(): void {
      delete providers[provider.id]
    },
  }
}

const commandMap = {
  'ExtensionApi.executeFileSystemProviderGetPathSeparator': executeFileSystemProviderGetPathSeparator,
  'ExtensionApi.executeFileSystemProviderIsReadonly': executeFileSystemProviderIsReadonly,
  'ExtensionApi.executeFileSystemProviderMkdir': executeFileSystemProviderMkdir,
  'ExtensionApi.executeFileSystemProviderReadDirWithFileTypes': executeFileSystemProviderReadDirWithFileTypes,
  'ExtensionApi.executeFileSystemProviderReadFile': executeFileSystemProviderReadFile,
  'ExtensionApi.executeFileSystemProviderRemove': executeFileSystemProviderRemove,
  'ExtensionApi.executeFileSystemProviderRename': executeFileSystemProviderRename,
  'ExtensionApi.executeFileSystemProviderWriteFile': executeFileSystemProviderWriteFile,
  'ExtensionApi.getFileSystemProviderRegistrySnapshot': getFileSystemProviderRegistrySnapshot,
}

export const resetFileSystemProviderRegistry = (): void => {
  for (const id of Object.keys(providers)) {
    delete providers[id]
  }
}
