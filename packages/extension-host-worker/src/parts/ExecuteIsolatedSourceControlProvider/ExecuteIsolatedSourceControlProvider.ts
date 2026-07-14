import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

interface SourceControlProviderResult {
  readonly found: boolean
  readonly result?: unknown
}

const isUnavailableError = (error: unknown): boolean => {
  return (
    (error instanceof Error && error.name === 'CommandNotFoundError') ||
    (error instanceof TypeError && error.message === "Cannot read properties of undefined (reading 'invoke')")
  )
}

export const getEnabledProviderIds = async (scheme: string, root: string): Promise<readonly string[]> => {
  try {
    return await ExtensionManagementWorker.invoke('Extensions.getEnabledSourceControlProviderIds', scheme, root)
  } catch (error) {
    if (isUnavailableError(error)) {
      return []
    }
    throw error
  }
}

export const execute = async (providerId: string, methodName: string, ...args: readonly unknown[]): Promise<SourceControlProviderResult> => {
  try {
    return await ExtensionManagementWorker.invoke('Extensions.executeSourceControlProvider', providerId, methodName, ...args)
  } catch (error) {
    if (isUnavailableError(error)) {
      return { found: false }
    }
    throw error
  }
}
