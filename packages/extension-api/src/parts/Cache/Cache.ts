import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

/**
 * Opens persistent OPFS storage scoped to this extension. Names must be 1–80
 * lowercase letters, digits or hyphens, beginning with a letter or digit.
 * Dedicated workers may clone this handle and open a synchronous access handle.
 * Clients own access-handle disposal, cache bounds, integrity and invalidation.
 * Storage or exclusive-lock failures should fall back to uncached operation.
 */
export const getCacheFileHandle = async (name: string): Promise<FileSystemFileHandle> => {
  return ExtensionManagementWorker.invoke('Extensions.getCacheFileHandle', name)
}
