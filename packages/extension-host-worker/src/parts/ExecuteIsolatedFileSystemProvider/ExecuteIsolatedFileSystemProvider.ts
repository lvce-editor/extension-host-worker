import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

interface FileSystemProviderResult {
  readonly found: boolean
  readonly result?: unknown
}

const isUnavailableError = (error: unknown): boolean => {
  return (
    (error instanceof Error && error.name === 'CommandNotFoundError') ||
    (error instanceof TypeError && error.message === "Cannot read properties of undefined (reading 'invoke')")
  )
}

const executeMethod = async (method: string, providerId: string, ...args: readonly unknown[]): Promise<FileSystemProviderResult> => {
  try {
    return await ExtensionManagementWorker.invoke(method, providerId, ...args)
  } catch (error) {
    if (isUnavailableError(error)) {
      return { found: false }
    }
    throw error
  }
}

export const execute = (providerId: string, uri: string): Promise<FileSystemProviderResult> => {
  return executeMethod('Extensions.executeFileSystemProviderReadFile', providerId, uri)
}

export const getPathSeparator = (providerId: string): Promise<FileSystemProviderResult> => {
  return executeMethod('Extensions.executeFileSystemProviderGetPathSeparator', providerId)
}

export const isReadonly = (providerId: string): Promise<FileSystemProviderResult> => {
  return executeMethod('Extensions.executeFileSystemProviderIsReadonly', providerId)
}

export const readDirWithFileTypes = (providerId: string, uri: string): Promise<FileSystemProviderResult> => {
  return executeMethod('Extensions.executeFileSystemProviderReadDirWithFileTypes', providerId, uri)
}
