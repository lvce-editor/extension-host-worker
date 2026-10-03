import { initializeCacheWorker } from '../CacheWorker/CacheWorker.ts'

export interface CacheStorageItem {
  readonly blob: Blob
  readonly headers: Readonly<Record<string, string>>
  readonly status: number
  readonly statusText: string
}

export type CacheStorageWriteResult =
  { readonly success: true } | { readonly success: false; readonly errorCode: 'CACHE_STORAGE_WRITE_FAILED'; readonly errorMessage: string }

export const getCacheStorageItem = async (key: string): Promise<CacheStorageItem | null> => {
  const cacheWorker = await initializeCacheWorker()
  const item = await cacheWorker.invoke('ExtensionsCache.getCacheStorageItem', key)
  if (!item) {
    return null
  }
  const contentType = item.headers['content-type'] || ''
  return {
    blob: new Blob([item.body], { type: contentType }),
    headers: item.headers,
    status: item.status,
    statusText: item.statusText,
  }
}

export const setCacheStorageItem = async (
  key: string,
  blob: Blob,
  headers: Readonly<Record<string, string>> = {},
): Promise<CacheStorageWriteResult> => {
  const cacheWorker = await initializeCacheWorker()
  return cacheWorker.invoke('ExtensionsCache.setCacheStorageItem', key, blob, headers)
}

export const removeCacheStorageItem = async (key: string): Promise<boolean> => {
  const cacheWorker = await initializeCacheWorker()
  return cacheWorker.invoke('ExtensionsCache.removeCacheStorageItem', key)
}
