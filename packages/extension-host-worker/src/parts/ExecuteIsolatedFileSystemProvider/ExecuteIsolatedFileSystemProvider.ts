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

export const execute = async (providerId: string, uri: string): Promise<FileSystemProviderResult> => {
  try {
    return await ExtensionManagementWorker.invoke('Extensions.executeFileSystemProviderReadFile', providerId, uri)
  } catch (error) {
    if (isUnavailableError(error)) {
      return { found: false }
    }
    throw error
  }
}
